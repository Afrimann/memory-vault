export function BackgroundPattern() {
    return (
        <>
            <div className="fixed inset-0 bg-background -z-50" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-100/40 via-background to-background dark:from-indigo-950/20 -z-50" />
            <div className="fixed top-0 right-0 -mr-40 -mt-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000 -z-40 pointer-events-none" />
            <div className="fixed bottom-0 left-0 -ml-40 -mb-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse -z-40 pointer-events-none" />
        </>
    );
}
