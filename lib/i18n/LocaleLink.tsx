"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "./LocaleContext";
import { getLocalePath, type PathLike } from "./utils";

type LocaleLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: PathLike;
  preserveLocale?: boolean;
};

export function LocaleLink({ href, preserveLocale = true, children, ...rest }: LocaleLinkProps) {
  const { locale } = useLocale();
  const target = preserveLocale ? getLocalePath(locale, href) : (href as string);
  return (
    <Link href={target} {...rest}>
      {children}
    </Link>
  );
}

export { getLocalePath };
