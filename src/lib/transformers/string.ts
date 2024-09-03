export const formatArticleTopic = (topic: string) => {
  console.log("topic - ", topic);
  if (topic === "artificial-intelligence") return "AI";
  if (topic === "product-management") return "PM";
  return topic;
};
