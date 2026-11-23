function twoSum(nums, target){

  let seen = new Map();

for (i = 0; i < nums.length; i++){

  let comfront = target - nums[i]

  if(seen.has(comfront)){
    return [seen.get(comfront), nums[i]]
  }

  seen.add(comfront);

}

return seen;
}