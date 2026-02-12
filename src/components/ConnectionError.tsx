import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionErrorProps {
    onRetry: () => void;
    message?: string;
}

export function ConnectionError({ onRetry, message }: ConnectionErrorProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 h-full min-h-[300px]">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div className="max-w-md space-y-2">
                <h3 className="text-xl font-bold text-foreground">Connection Issue</h3>
                <p className="text-muted-foreground">
                    {message || "Our free server is sleeping/waking up. This may take up to 30-60 seconds on the first request."}
                </p>
            </div>
            <Button
                onClick={onRetry}
                variant="outline"
                className="gap-2 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/10 dark:hover:bg-yellow-900/30 dark:text-yellow-400"
            >
                <RefreshCw className="w-4 h-4" />
                Waking up Server... (Retry)
            </Button>
        </div>
    );
}
