import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  //   todo: why don't use join directly, but
  //   return sortedIds.join("--");

  return `${sortedIds[0]}--${sortedIds[1]}`;
}
