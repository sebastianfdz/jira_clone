export const moveItemWithinArray = (
  arr: unknown[],
  item: unknown,
  newIndex: number
) => {
  // Snippet taken from https://github.com/oldboyxx/jira_clone
  const arrClone = [...arr];
  const oldIndex = arrClone.indexOf(item);
  arrClone.splice(newIndex, 0, arrClone.splice(oldIndex, 1)[0]);
  return arrClone;
};

export const insertItemIntoArray = (
  arr: unknown[],
  item: unknown,
  index: number
) => {
  // Snippet taken from https://github.com/oldboyxx/jira_clone
  const arrClone = [...arr];
  arrClone.splice(index, 0, item);
  return arrClone;
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
