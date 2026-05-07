import ScrollProgressBar from '@/components/ScrollProgressBar';

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      {children}
    </>
  );
}
