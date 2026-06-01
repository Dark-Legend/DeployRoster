import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="glass-card p-12 text-center max-w-md">
        <Terminal className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
        <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild variant="secondary">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
