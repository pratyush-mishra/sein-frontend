import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Image } from "@heroui/image";

export default function Home() {
  return (
    <div>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title({ color: "blue" })}>Insert name here&nbsp;</span>
          <br />
          <span className={title()}>
            Lend and share resources with other SEIN members.
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            As you can see, we're still stuck on a name. Sharespace? Wee Commons? Resource Hub? You decide!
          </div>
        </div>  

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
            href="/signup"
          >
            Sign Up
          </Link>
          <Link
            className={buttonStyles({ variant: "shadow", radius: "full", size:"lg" })}
            href="/signin"
          >
            Sign In
          </Link>
        </div>
      </section>
      <div className="flex justify-center mt-8">
        <Image src="/bg-art.png" alt="Decorative" width={600}/>
      </div>
    </div>
  );
}
