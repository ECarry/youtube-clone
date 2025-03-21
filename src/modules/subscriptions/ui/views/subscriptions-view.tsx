import { SubscriptionsSection } from "../sections/subscriptions-section";

export const SubscriptionsView = () => {
  return (
    <div className="max-w-[1200px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">All subscriptions</h1>
        <p className="text-xs text-muted-foreground">View all subscriptions</p>
      </div>
      <SubscriptionsSection />
    </div>
  );
};
