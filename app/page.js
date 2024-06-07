import Layout from "@/components/Layout";
import { LayoutProvider } from "@/context/LayoutContext";
import { Providers } from "./providers";

export default function Home() {
  return (
    <main className="">
      <Providers>
        <main className="dark text-foreground bg-background">
          <Layout />
        </main>
      </Providers>
    </main>
  );
}
