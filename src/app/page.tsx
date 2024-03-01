import PageLayout from "@/components/layout/PageLayout";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout showHeader pageTitle="首页">
      {children}
    </PageLayout>
  );
}
