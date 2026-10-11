'use client';

import Link from 'next/link';
import { ROUTES } from '@shared/constants';
import { ScreenHeader } from '@shared/components/layout';
import { ListRow } from '@shared/components/ios';
import { Card } from '@shared/components/ui';
import { useLocale } from '@shared/hooks';
import { HELP_CONTENT, HELP_TOPICS, type HelpBlock, type HelpTopic } from './content';

const TITLE = { ar: 'المساعدة والسياسات', en: 'Help & policies' } as const;
const DRAFT_NOTICE = {
  ar: 'مسودة: هذه الصفحة قيد المراجعة، ومنها المراجعة القانونية، وقد تتغير قبل اعتمادها. والبنود المعلَّمة «قيد التأكيد» لم تُحسم بعد.',
  en: 'Draft: this page is still being reviewed, including legally, and may change before it is final. Points marked “To be confirmed” are not decided yet.',
} as const;
const PENDING_LABEL = { ar: 'قيد التأكيد', en: 'To be confirmed' } as const;

/** The list of help and policy pages (public). */
export function HelpIndexPage() {
  const { locale } = useLocale();
  return (
    <>
      <ScreenHeader title={TITLE[locale]} backHref={ROUTES.home} />
      <div className="px-gutter pb-6">
        <Card className="overflow-hidden">
          {HELP_TOPICS.map((topic, index) => {
            const page = HELP_CONTENT[topic][locale];
            return (
              <ListRow
                key={topic}
                title={page.title}
                subtitle={page.summary}
                href={ROUTES.helpTopic(topic)}
                isLast={index === HELP_TOPICS.length - 1}
              />
            );
          })}
        </Card>
      </div>
    </>
  );
}

/** A section's blocks, strictly in the order they are written. */
export function HelpBlocks({ blocks, locale }: { blocks: HelpBlock[]; locale: 'ar' | 'en' }) {
  return blocks.map((block, index) => {
    const key = `${block.type}-${index}`;
    switch (block.type) {
      case 'paragraph':
        return <p key={key}>{block.text}</p>;
      case 'bullets':
        return (
          <ul key={key} className="flex list-disc flex-col gap-1 ps-5">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      case 'link':
        return (
          <p key={key}>
            <Link href={block.href} className="font-medium text-accent hover:underline">
              {block.text}
            </Link>
          </p>
        );
      case 'pending':
        return (
          <p
            key={key}
            role="note"
            data-testid="help-pending"
            className="rounded-md border border-dashed border-warning/60 px-3 py-2 text-footnote text-foreground-soft"
          >
            <span className="font-semibold text-foreground">{PENDING_LABEL[locale]}:</span>{' '}
            {block.text}
          </p>
        );
    }
  });
}

/** One help or policy page; drafts say so before anything else. */
export function HelpTopicPage({ topic }: { topic: HelpTopic }) {
  const { locale } = useLocale();
  const page = HELP_CONTENT[topic][locale];
  return (
    <>
      <ScreenHeader title={page.title} backHref={ROUTES.help} />
      <article className="flex flex-col gap-4 px-gutter pb-6">
        {page.isDraft ? (
          <p
            role="note"
            className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-footnote font-semibold text-foreground"
            data-testid="help-draft"
          >
            {DRAFT_NOTICE[locale]}
          </p>
        ) : null}
        <p className="text-subhead text-foreground-soft">{page.summary}</p>
        {page.sections.map((section) => (
          <Card
            key={section.id}
            id={section.id}
            isInset
            className="flex scroll-mt-20 flex-col gap-2 text-subhead"
          >
            <h2 className="text-headline font-semibold text-foreground">{section.heading}</h2>
            <HelpBlocks blocks={section.blocks} locale={locale} />
          </Card>
        ))}
      </article>
    </>
  );
}
