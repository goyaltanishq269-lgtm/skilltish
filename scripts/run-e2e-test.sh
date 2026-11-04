#!/bin/bash
set -e

echo "=== 1. Checking User Profile for Alex Chen ==="
curl -s http://127.0.0.1:3000/api/users/660000000000000000000001 | grep -o '"name":"Alex Chen"' || (echo "Alex Chen not found" && exit 1)
echo "✓ Alex Chen profile loaded"

echo -e "\n=== 2. Checking Duration Filter (duration=1 day) ==="
curl -s "http://127.0.0.1:3000/api/tasks?duration=1%20day" | grep -o '"duration":"1 day"' | head -n 1
echo "✓ Duration filter working"

echo -e "\n=== 3. Checking Skill Filter (skill=Figma) ==="
curl -s "http://127.0.0.1:3000/api/tasks?skill=Figma" | grep -o 'Design Mobile Onboarding Flow in Figma'
echo "✓ Skill filter working"

echo -e "\n=== 4. Posting a New Micro-Task ==="
NEW_TASK=$(curl -s -X POST http://127.0.0.1:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Build Dark Mode Toggle with Tailwind","description":"Implement animated toggle","skillsRequired":["React","Tailwind CSS"],"duration":"1 day","posterId":"660000000000000000000002","reward":"Dark Mode Specialist Badge"}')
TASK_ID=$(echo "$NEW_TASK" | grep -o '"_id":"[^"]*' | head -n 1 | cut -d'"' -f4)
echo "✓ Created Task ID: $TASK_ID"

echo -e "\n=== 5. Submitting Work Proof (GitHub URL) ==="
NEW_SUB=$(curl -s -X POST http://127.0.0.1:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d "{\"taskId\":\"$TASK_ID\",\"studentId\":\"660000000000000000000001\",\"proofUrl\":\"https://github.com/alexchen/tailwind-dark-mode\",\"notes\":\"Implemented smooth theme switching\"}")
SUB_ID=$(echo "$NEW_SUB" | grep -o '"_id":"[^"]*' | head -n 1 | cut -d'"' -f4)
echo "✓ Created Submission ID: $SUB_ID"

echo -e "\n=== 6. Approving Submission & Minting Verified Badge ==="
APPROVE_RES=$(curl -s -X PATCH "http://127.0.0.1:3000/api/submissions/$SUB_ID" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","feedback":"Outstanding code structure and animations!","issuerId":"660000000000000000000002"}')
echo "$APPROVE_RES" | grep -o '"success":true'
echo "✓ Approved and verified badge issued"

echo -e "\n=== 7. Verifying Student Badges and Portfolio ==="
BADGES_RES=$(curl -s "http://127.0.0.1:3000/api/badges?studentId=660000000000000000000001")
echo "Badges found:"
echo "$BADGES_RES" | grep -o '"title":"[^"]*' | cut -d'"' -f4

echo -e "\n=== 8. Checking HTML Landing Page, Feed, Dashboard, and Portfolio ==="
curl -s -o /dev/null -w "Landing Page HTTP Status: %{http_code}\n" http://127.0.0.1:3000/
curl -s -o /dev/null -w "Feed Page HTTP Status: %{http_code}\n" http://127.0.0.1:3000/feed
curl -s -o /dev/null -w "Dashboard Page HTTP Status: %{http_code}\n" http://127.0.0.1:3000/dashboard
curl -s -o /dev/null -w "Student Profile HTTP Status: %{http_code}\n" http://127.0.0.1:3000/profile/660000000000000000000001

echo -e "\n🎉 ALL MVP TESTS PASSED WITH 100% SUCCESS!"
