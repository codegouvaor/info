"use client";

import { CallOut } from "@codegouvaor/react-ads/CallOut";
import { Tile } from "@codegouvaor/react-ads/Tile";
import { ButtonsGroup } from "@codegouvaor/react-ads/ButtonsGroup";
import type { FrIconClassName } from "@codegouvaor/react-ads/fr";

/**
 * Thin serializable wrappers around ADS building blocks.
 *
 * Server-rendered page content cannot pass functions or elements to client
 * components, so the portal exposes the ADS primitives it needs through these
 * tiny client boundaries (strings and hrefs only). The visual and behavioural
 * source of truth stays in @codegouvaor/react-ads.
 */

export function NoticeCallout({
  iconId,
  title,
  children,
}: {
  iconId?: FrIconClassName;
  title?: string;
  children: string;
}) {
  return (
    <CallOut iconId={iconId} title={title}>
      {children}
    </CallOut>
  );
}

export type LinkTileProps = {
  title: string;
  desc?: string;
  href: string;
  small?: boolean;
  grey?: boolean;
  iconId?: FrIconClassName;
};

export function LinkTile({ title, desc, href, small, grey, iconId }: LinkTileProps) {
  return (
    <Tile
      small={small}
      grey={grey}
      title={title}
      desc={desc}
      pictogram={
        <span aria-hidden="true" className={iconId ?? "fr-icon-arrow-right-line"} />
      }
      linkProps={{ href }}
    />
  );
}

export type CtaButton = {
  children: string;
  href: string;
  title?: string;
  priority?: "primary" | "secondary" | "tertiary" | "tertiary no outline";
  iconId?: FrIconClassName;
  iconPosition?: "left" | "right";
};

export function CtaButtonsGroup({
  buttons,
  alignment = "left",
}: {
  buttons: [CtaButton, ...CtaButton[]];
  alignment?: "left" | "center" | "right" | "between";
}) {
  const adsButtons = buttons.map((button) => {
    const common = {
      priority: button.priority ?? "primary",
      children: button.children,
      title: button.title,
      linkProps: { href: button.href },
    };

    return button.iconId
      ? {
          ...common,
          iconId: button.iconId,
          iconPosition: button.iconPosition ?? "right",
        }
      : common;
  });

  return (
    <ButtonsGroup
      inlineLayoutWhen="md and up"
      alignment={alignment}
      buttons={adsButtons as Parameters<typeof ButtonsGroup>[0]["buttons"]}
    />
  );
}
