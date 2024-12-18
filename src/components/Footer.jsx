"use client"
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background py-6">
                {/* Copyright */}
                <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-muted-foreground text-sm">
                        © {currentYear} <b>Mytro</b> All Rights Reserved.
                    </p>
                </div>
        </footer>
    );
}