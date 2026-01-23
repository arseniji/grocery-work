export const separateWorlds = (world: string) => {
  let ans = "";

  for (let i = 0; i < world.length; i++) {
    if (i === 0) {
      ans += world[i].toUpperCase();
      continue;
    }

    if (world[i].toUpperCase() === world[i]) {
      ans += " " + world[i].toLocaleLowerCase();
    } else {
      ans += world[i];
    }
  }

  return ans;
};
