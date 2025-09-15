import { Link, useLocation } from "react-router-dom";

export default function Placeholder() {
  const { pathname } = useLocation();
  return (
    <section className="py-24">
      <div className="container max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          This page is coming soon
        </h1>
        <p className="text-foreground/70 mb-6">
          We haven't filled in the content for{" "}
          <span className="font-semibold">{pathname}</span> yet. Tell us what
          you want here and we'll build it.
        </p>
        <Link
          className="text-primary font-semibold underline underline-offset-4"
          to="/"
        >
          Go back home
        </Link>
      </div>
    </section>
  );
}
