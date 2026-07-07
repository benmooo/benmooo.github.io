const tokenPattern = /[\u4e00-\u9fff]|[a-zA-Z0-9_]+/g;
const averageTokensPerMinute = 220;

export const estimateReadingMinutes = (content: string) => {
  const tokenCount = content.match(tokenPattern)?.length ?? 0;

  return Math.max(1, Math.round(tokenCount / averageTokensPerMinute));
};
