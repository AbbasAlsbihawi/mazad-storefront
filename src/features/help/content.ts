/*
 * Help and trust pages: how auctions work, paying, returns, selling, common questions, privacy and
 * terms. Plain content in both languages, kept here (not in the i18n bundles) because it is
 * long-form and reviewed as a whole.
 *
 * Every claim here is checked against mazad-api (auction rules, settlement, returns, payments,
 * account deletion). Anything the owner or a lawyer still has to decide carries a reference:
 * - `OD-n` (OWNER_DECISION) and `LR-n` (LEGAL_REVIEW_REQUIRED), listed with their open questions in
 *   docs/LEGAL-REVIEW.md. A test keeps the two in step.
 * - A `pending` block is shown to users as a "To be confirmed" note. A section `review` reference
 *   marks wording that a lawyer must approve; Privacy and Terms say so once, at the top.
 * Never add a company name, registration number, address, email or phone here until the owner
 * provides it.
 */

import { ROUTES } from '@shared/constants';

export const HELP_TOPICS = [
  'how-auctions-work',
  'payments',
  'returns',
  'selling',
  'faq',
  'privacy',
  'terms',
] as const;
export type HelpTopic = (typeof HELP_TOPICS)[number];

/** OD-n: the owner must decide. LR-n: a lawyer must review the wording. See docs/LEGAL-REVIEW.md. */
export type ReviewRef = `OD-${number}` | `LR-${number}`;
export type ReviewMarker = 'OWNER_DECISION' | 'LEGAL_REVIEW_REQUIRED';

export function markerOf(ref: ReviewRef): ReviewMarker {
  return ref.startsWith('OD-') ? 'OWNER_DECISION' : 'LEGAL_REVIEW_REQUIRED';
}

/** A section's content, rendered strictly in this order. */
export type HelpBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  /** A link to another page of the site. */
  | { type: 'link'; href: string; text: string }
  /** Not decided yet: shown as a "To be confirmed" note. */
  | { type: 'pending'; ref: ReviewRef; text: string };

export interface HelpSection {
  /** Stable anchor, the same in both languages (`/help/terms#prohibited-items`). Don't rename. */
  id: string;
  heading: string;
  blocks: HelpBlock[];
  /** The section's wording needs legal review (not rendered; Privacy and Terms carry one notice). */
  review?: ReviewRef;
}

export interface HelpPageContent {
  title: string;
  summary: string;
  /** Not yet approved by legal review: shown with a visible draft notice. */
  isDraft?: boolean;
  sections: HelpSection[];
}

type Bilingual = Record<'ar' | 'en', HelpPageContent>;

/** The public account-deletion page (src/app/account-deletion). */
const ACCOUNT_DELETION_PATH = '/account-deletion';

const p = (text: string): HelpBlock => ({ type: 'paragraph', text });
const ul = (...items: string[]): HelpBlock => ({ type: 'bullets', items });
const link = (href: string, text: string): HelpBlock => ({ type: 'link', href, text });
const tbc = (ref: ReviewRef, text: string): HelpBlock => ({ type: 'pending', ref, text });

const SUPPORT_TBC = {
  ar: tbc('OD-2', 'جهة التواصل مع الدعم: سيُعلَن عنها لاحقًا.'),
  en: tbc('OD-2', 'Support contact: to be announced.'),
};

const LADDER = {
  ar: ul(
    'أقل من 100,000 د.ع: خطوة 1,000 د.ع',
    'من 100,000 حتى أقل من مليون: خطوة 5,000 د.ع',
    'من مليون حتى أقل من 10 ملايين: خطوة 25,000 د.ع',
    '10 ملايين فما فوق: خطوة 100,000 د.ع',
  ),
  en: ul(
    'Under 100,000 IQD: 1,000 IQD',
    '100,000 to under 1 million: 5,000 IQD',
    '1 million to under 10 million: 25,000 IQD',
    '10 million and above: 100,000 IQD',
  ),
};

export const HELP_CONTENT: Record<HelpTopic, Bilingual> = {
  'how-auctions-work': {
    ar: {
      title: 'كيف تعمل المزادات',
      summary: 'زايد على ما تريد، وإذا فزت يُنشأ طلبك تلقائيًا ويصلك إلى عنوانك.',
      sections: [
        {
          id: 'who-sells',
          heading: 'من يبيع؟',
          blocks: [
            p(
              'مزاد سوق إلكتروني: البائعون، أفرادًا ومتاجر، يعرضون منتجاتهم الخاصة، ومزاد توفّر المنصة. البائع، لا مزاد، هو من يبيع المنتج ويوصله.',
            ),
          ],
        },
        {
          id: 'before-you-bid',
          heading: 'قبل المزايدة',
          blocks: [
            p(
              'افتح المزاد واقرأ الوصف وشاهد كل الصور، وتحقق من حالة المنتج ومدينة المتجر ورسوم التوصيل.',
            ),
            p(
              'للمزايدة تحتاج إلى حساب ورقم هاتف مُتحقَّق منه وعنوان توصيل محفوظ واحد على الأقل. إذا فزت يُرسَل الطلب إلى عنوانك الافتراضي، فأبقِه محدَّثًا. في تطبيق أندرويد يمكنك أيضًا تحديد الموقع على الخريطة.',
            ),
          ],
        },
        {
          id: 'bidding',
          heading: 'المزايدة',
          blocks: [
            p(
              'كل مزايدة جديدة يجب أن تكون أعلى من السعر الحالي بخطوة على الأقل، وبالدينار الكامل دون كسور. تحدد مزاد الخطوة حسب السعر:',
            ),
            LADDER.ar,
            p(
              'يمكن أن تكون المزايدة الأولى بسعر الافتتاح. المزايدة التزام: لا يمكنك سحبها، وإذا فزت فأنت ملزم بإكمال الشراء. ولا يستطيع البائع المزايدة على مزاده.',
            ),
            p('يظهر في سجل المزايدات اسم مستعار لكل مزايد، ولا يظهر اسمك أبدًا.'),
          ],
        },
        {
          id: 'automatic-bidding',
          heading: 'المزايدة التلقائية',
          blocks: [
            p(
              'حدد أعلى مبلغ تقبل دفعه، وتزايد مزاد عنك بأقل خطوة لازمة لتبقى في الصدارة، دون تجاوز حدك. يمكنك تغيير الحد أو إيقافه في أي وقت، وتبقى المزايدات التي قُدِّمت قبل الإيقاف قائمة.',
            ),
          ],
        },
        {
          id: 'buy-now',
          heading: 'الشراء الفوري',
          blocks: [
            p(
              'لبعض المزادات سعر شراء فوري. ما دام السعر الحالي أقل منه يمكنك شراء المنتج بهذا السعر مباشرة: ينتهي المزاد فورًا وتكون أنت الفائز. والمزايدة بمبلغ يساوي سعر الشراء الفوري أو يزيد عليه تُعدّ شراءً فوريًا بسعر الشراء الفوري.',
            ),
          ],
        },
        {
          id: 'late-bids',
          heading: 'التمديد عند المزايدة المتأخرة',
          blocks: [
            p(
              'إذا وصلت مزايدة في الدقائق الأخيرة يُمدَّد المزاد بضع دقائق حتى يتمكن الآخرون من الرد. تحدد مزاد هذه المدد، ولا تزيد أي منها على 10 دقائق، ويمكن تمديد المزاد 10 مرات على الأكثر. يظهر وقت الانتهاء الجديد على صفحة المزاد.',
            ),
          ],
        },
        {
          id: 'when-it-ends',
          heading: 'بعد انتهاء المزاد',
          blocks: [
            p(
              'يفوز صاحب أعلى مزايدة. تُنشئ مزاد الطلب تلقائيًا إلى عنوان التوصيل الافتراضي وتبلغك بذلك، ولا تحتاج إلى تأكيد أي شيء.',
            ),
            p(
              'إجمالي الطلب هو سعر الفوز مضافًا إليه رسوم توصيل المتجر المعروضة في صفحة المزاد. تختار طريقة الدفع من صفحة الطلب: الدفع عند الاستلام، أو الدفع بالبطاقة إن كان متاحًا.',
            ),
            p('يمكنك إلغاء الطلب فقط قبل أن يؤكده البائع. والطلب الملغى لا يُنقل إلى مزايد آخر.'),
            p(
              'إذا تعذّر إنشاء الطلب للفائز، كأن لا يكون لديه عنوان توصيل أو لم يعد حسابه نشطًا، ينتقل الفوز إلى صاحب المزايدة الأعلى التالية، مرتين على الأكثر. والمزاد الذي لا مزايدات عليه ينتهي دون بيع.',
            ),
            p(
              'خسارة الفوز بسبب عدم وجود عنوان توصيل تُحتسب على حسابك، وتكرارها يؤدي إلى حظر الحساب تلقائيًا.',
            ),
          ],
        },
      ],
    },
    en: {
      title: 'How auctions work',
      summary:
        'Bid on what you want; if you win, your order is created for you and delivered to your address.',
      sections: [
        {
          id: 'who-sells',
          heading: 'Who sells?',
          blocks: [
            p(
              'Mazad is a marketplace: sellers, both individuals and stores, list their own items, and Mazad provides the platform. The seller, not Mazad, sells the item and delivers it.',
            ),
          ],
        },
        {
          id: 'before-you-bid',
          heading: 'Before you bid',
          blocks: [
            p(
              'Open the auction, read the description, look at every photo, and check the condition, the store’s city and the delivery fee.',
            ),
            p(
              'To bid you need an account with a verified phone number and at least one saved delivery address. If you win, the order goes to your default address, so keep it up to date. In the Android app you can also pin the location on a map.',
            ),
          ],
        },
        {
          id: 'bidding',
          heading: 'Bidding',
          blocks: [
            p(
              'Each new bid must beat the current price by at least one step, in whole dinars. Mazad sets the step by price:',
            ),
            LADDER.en,
            p(
              'The first bid can be the opening price. A bid is a commitment: you can’t withdraw it, and if you win you are expected to complete the purchase. Sellers can’t bid on their own auctions.',
            ),
            p('The bid history shows an anonymous label for each bidder, never your name.'),
          ],
        },
        {
          id: 'automatic-bidding',
          heading: 'Automatic bidding',
          blocks: [
            p(
              'Set the most you are willing to pay, and Mazad bids for you by the smallest step needed to keep you in the lead, never above your limit. You can change or stop it at any time; bids it already placed stay.',
            ),
          ],
        },
        {
          id: 'buy-now',
          heading: 'Buy now',
          blocks: [
            p(
              'Some auctions have a buy-now price. While the current price is below it, you can buy the item at that price straight away: the auction ends at once and you are the winner. A bid at or above the buy-now price counts as buying it now, at the buy-now price.',
            ),
          ],
        },
        {
          id: 'late-bids',
          heading: 'Late bids extend the auction',
          blocks: [
            p(
              'If a bid arrives in the last few minutes, the auction is extended by a few minutes so others can answer. Mazad sets these times, never more than 10 minutes, and an auction can be extended at most 10 times. The new end time shows on the auction page.',
            ),
          ],
        },
        {
          id: 'when-it-ends',
          heading: 'When the auction ends',
          blocks: [
            p(
              'The highest bidder wins. Mazad creates the order automatically, to your default delivery address, and tells you. You don’t need to confirm anything.',
            ),
            p(
              'The order total is your winning price plus the store’s delivery fee shown on the auction page. You choose how to pay on the order page: cash on delivery, or card where card payment is available.',
            ),
            p(
              'You can cancel the order only until the seller confirms it. A cancelled order isn’t passed on to another bidder.',
            ),
            p(
              'If the order can’t be created for the winner, for example because they have no delivery address or their account is no longer active, the win passes to the next-highest bidder, at most twice. An auction with no bids ends unsold.',
            ),
            p(
              'Losing a win because you have no delivery address counts against your account, and repeated cases lead to an automatic ban.',
            ),
          ],
        },
      ],
    },
  },
  payments: {
    ar: {
      title: 'طرق الدفع',
      summary:
        'تدفع ثمن الطلب بعد الفوز: نقدًا عند الاستلام، أو بالبطاقة عبر SwiftPayIQ حيث يتوفر.',
      sections: [
        {
          id: 'when-you-pay',
          heading: 'متى تدفع',
          blocks: [
            p(
              'عند فوزك أو شرائك الفوري تُنشئ مزاد طلبك تلقائيًا. الإجمالي هو سعر المنتج مضافًا إليه رسوم التوصيل. في صفحة الطلب يمكنك إبقاء الدفع عند الاستلام، أو الدفع بالبطاقة إن كان متاحًا، ما دام الطلب قيد الانتظار أو مؤكدًا أو قيد التوصيل.',
            ),
          ],
        },
        {
          id: 'cash-on-delivery',
          heading: 'الدفع عند الاستلام',
          blocks: [
            p(
              'ادفع للبائع إجمالي الطلب نقدًا عند وصوله. يؤكد البائع بعدها في التطبيق المبلغ الذي استلمه بالضبط، ويجب أن يساوي إجمالي الطلب، ثم يُسجَّل الطلب مُسلَّمًا ومدفوعًا.',
            ),
          ],
        },
        {
          id: 'card',
          heading: 'الدفع بالبطاقة',
          blocks: [
            p(
              'يتولى الدفع بالبطاقة مزوّد الدفع SwiftPayIQ، وهو جهة خارجية. تُدخل بيانات بطاقتك في صفحة الدفع الآمنة لدى SwiftPayIQ، ولا ترى مزاد هذه البيانات ولا تخزنها. تظهر البطاقات المقبولة في تلك الصفحة.',
            ),
            p(
              'يتحقق خادم مزاد من كل دفعة مباشرة مع SwiftPayIQ قبل اعتبار الطلب مدفوعًا، ويُسجَّل الطلب مدفوعًا مرة واحدة فقط. وإذا وصلت دفعة ثانية للطلب نفسه تُحال إلى مزاد لمراجعتها.',
            ),
            p('عندما لا يكون الدفع بالبطاقة متاحًا، تعرض صفحة الطلب الدفع عند الاستلام فقط.'),
            tbc(
              'OD-6',
              'رسوم معالجة البطاقة: تعتزم مزاد تحمّلها، فتدفع إجمالي الطلب فقط. سيُؤكَّد ذلك قبل فتح الدفع بالبطاقة.',
            ),
          ],
        },
        {
          id: 'refunds',
          heading: 'استرداد المبالغ',
          blocks: [
            p(
              'تُسترد مبالغ المنتجات المُرجعة وفق خطوات الإرجاع. ومدفوعات البطاقة تُسترد عبر SwiftPayIQ وليس نقدًا.',
            ),
            link(ROUTES.helpTopic('returns'), 'كيف يعمل الإرجاع'),
            tbc('OD-9', 'المدة التي يستغرقها وصول المبلغ المسترد إلى بطاقتك.'),
            tbc('OD-8', 'طريقة رد المبلغ في طلبات الدفع عند الاستلام.'),
          ],
        },
      ],
    },
    en: {
      title: 'Payment methods',
      summary:
        'You pay for an order after you win: cash on delivery, or card through SwiftPayIQ where available.',
      sections: [
        {
          id: 'when-you-pay',
          heading: 'When you pay',
          blocks: [
            p(
              'When you win or use buy now, Mazad creates your order automatically. The total is the item price plus the delivery fee. On the order page you can keep cash on delivery or, where card payment is available, pay by card while the order is pending, confirmed or out for delivery.',
            ),
          ],
        },
        {
          id: 'cash-on-delivery',
          heading: 'Cash on delivery',
          blocks: [
            p(
              'Pay the seller the order total in cash when the order arrives. The seller then confirms in the app the exact amount received, which must equal the order total, and the order is marked delivered and paid.',
            ),
          ],
        },
        {
          id: 'card',
          heading: 'Card',
          blocks: [
            p(
              'Card payments are handled by SwiftPayIQ, a third-party payment provider. You enter your card details on SwiftPayIQ’s secure payment page; Mazad never sees or stores them. The cards you can use are shown on that page.',
            ),
            p(
              'Mazad’s server confirms each payment directly with SwiftPayIQ before treating the order as paid, and an order is recorded as paid only once. If a second payment arrives for the same order, it is flagged for Mazad to review.',
            ),
            p('When card payment isn’t available, the order page offers cash on delivery only.'),
            tbc(
              'OD-6',
              'Card processing fees: Mazad intends to cover them, so you pay only the order total. This will be confirmed before card payments open.',
            ),
          ],
        },
        {
          id: 'refunds',
          heading: 'Refunds',
          blocks: [
            p(
              'Returned items are refunded through the returns process. Card payments are refunded through SwiftPayIQ, not in cash.',
            ),
            link(ROUTES.helpTopic('returns'), 'How returns work'),
            tbc('OD-9', 'How long a card refund takes to reach you.'),
            tbc('OD-8', 'How refunds are paid on cash-on-delivery orders.'),
          ],
        },
      ],
    },
  },
  returns: {
    ar: {
      title: 'الإرجاع',
      summary:
        'اطلب الإرجاع خلال 7 أيام من التسليم، وبعد أن يستعيد البائع المنتج يُعاد إليك المبلغ.',
      sections: [
        {
          id: 'how-to-request',
          heading: 'كيف تطلب الإرجاع',
          blocks: [
            p(
              'افتح الطلب المُسلَّم واختر «طلب إرجاع» للمنتج، واكتب السبب. يمكنك الطلب خلال 7 أيام من التسليم، مرة واحدة لكل منتج.',
            ),
            p(
              'يمكنك سحب طلبك ما دام البائع لم يستلم المنتج بعد، لكن لا يمكنك تقديم طلب جديد للمنتج نفسه بعد سحبه.',
            ),
          ],
        },
        {
          id: 'what-happens',
          heading: 'ماذا يحدث بعد ذلك',
          blocks: [
            ul(
              'يوافق البائع على الطلب أو يرفضه.',
              'بعد الموافقة تعيد المنتج إلى البائع.',
              'عندما يؤكد البائع (أو مزاد) استلام المنتج، يُسجَّل استرداد المبلغ لك.',
            ),
            p('المبلغ المسترد هو السعر الذي دفعته ثمنًا للمنتج، ولا تشمله رسوم التوصيل الأصلية.'),
            tbc('OD-7', 'من يرتّب إعادة المنتج إلى البائع ومن يدفع تكلفتها.'),
            tbc('OD-8', 'طريقة رد المبلغ في طلبات الدفع عند الاستلام.'),
          ],
        },
        {
          id: 'if-you-disagree',
          heading: 'إذا لم تتفقا',
          blocks: [
            p(
              'تُبلَّغ مزاد بكل طلب إرجاع ويمكنها التدخل: الموافقة على الإرجاع أو رفضه، وإعادة فتح طلب مرفوض، وتأكيد استلام المنتج، وتسجيل الاسترداد وتحديد مبلغه بما لا يزيد على سعر المنتج.',
            ),
            SUPPORT_TBC.ar,
          ],
        },
      ],
    },
    en: {
      title: 'Returns',
      summary:
        'Request a return within 7 days of delivery; once the seller has the item back, you are refunded.',
      sections: [
        {
          id: 'how-to-request',
          heading: 'How to request a return',
          blocks: [
            p(
              'Open the delivered order, choose "Request a return" on the item and say why. You can ask within 7 days of delivery, once per item.',
            ),
            p(
              'You can withdraw your request until the seller has the item back, but you can’t request a return of the same item again after withdrawing.',
            ),
          ],
        },
        {
          id: 'what-happens',
          heading: 'What happens next',
          blocks: [
            ul(
              'The seller approves or rejects the request.',
              'Once it is approved, you send the item back to the seller.',
              'When the seller (or Mazad) confirms the item came back, your refund is recorded.',
            ),
            p(
              'The refund is the price you paid for the item; the original delivery fee isn’t included.',
            ),
            tbc('OD-7', 'Who arranges and pays for sending a returned item back.'),
            tbc('OD-8', 'How refunds are paid on cash-on-delivery orders.'),
          ],
        },
        {
          id: 'if-you-disagree',
          heading: 'If you can’t agree',
          blocks: [
            p(
              'Mazad is told about every return request and can step in: approve or reject a return, reopen a rejected one, confirm the item came back, and record the refund, setting its amount up to the item’s price.',
            ),
            SUPPORT_TBC.en,
          ],
        },
      ],
    },
  },
  selling: {
    ar: {
      title: 'البيع على مزاد',
      summary: 'كيف تعرض منتجًا، وما تتوقعه مزاد من البائعين، والعمولة.',
      sections: [
        {
          id: 'get-started',
          heading: 'البدء',
          blocks: [
            p(
              'من حسابك افتح «البيع»: أنشئ متجرًا، وأضف منتجًا بصورة واحدة على الأقل، ثم أنشئ مزادًا. يكفي وصف بلغة واحدة.',
            ),
            ul(
              'سعر الافتتاح 1,000 د.ع على الأقل، بالدينار الكامل.',
              'سعر الشراء الفوري اختياري، ويجب أن يكون أعلى من سعر الافتتاح.',
              'مدة المزاد من ساعة واحدة إلى 14 يومًا.',
              'رسوم التوصيل تُؤخذ من إعدادات متجرك وتظهر للمزايدين.',
            ),
          ],
        },
        {
          id: 'approval',
          heading: 'المراجعة قبل النشر',
          blocks: [
            p(
              'قد تراجع مزاد المزادات قبل ظهورها، وهي حاليًا تُراجَع قبل نشرها. ويمكن لمزاد رفض المزاد، وتبلغك بذلك.',
            ),
            p(
              'يمكنك سحب مزادك ما دام مسودة أو مجدولًا أو بانتظار الموافقة أو مباشرًا بلا مزايدات. بعد أول مزايدة لا يمكن سحبه.',
            ),
          ],
        },
        {
          id: 'responsibilities',
          heading: 'مسؤولياتك كبائع',
          blocks: [
            ul(
              'اعرض فقط ما تملكه أو يحق لك بيعه.',
              'صف المنتج بصدق، بصور حقيقية للمنتج نفسه وحالته الفعلية.',
              'لا تعرض المنتجات المحظورة.',
              'أوصل المنتج الموصوف إلى عنوان المشتري دون تأخير.',
              'استخدم اسم المشتري وعنوانه وهاتفه لتوصيل الطلب فقط.',
              'تعامل مع طلبات الإرجاع بحسن نية.',
            ),
            link(ROUTES.helpTopic('terms'), 'الشروط والأحكام، ومنها قائمة المنتجات المحظورة'),
            tbc('OD-13', 'المدة المتاحة للبائع لتأكيد الطلب وتوصيله.'),
          ],
        },
        {
          id: 'orders',
          heading: 'الطلبات',
          blocks: [
            p(
              'عندما يُباع مزادك يظهر الطلب في «الطلبات الواردة». أكّده، ثم حوّله إلى «قيد التوصيل» عند خروجه، وأكّد التسليم عندما يستلمه المشتري. يمكنك إلغاء الطلب فقط قبل تأكيده.',
            ),
            p(
              'في الدفع عند الاستلام أدخل المبلغ النقدي الذي استلمته بالضبط، ويجب أن يساوي إجمالي الطلب. وإذا دفع المشتري مسبقًا بالبطاقة فلا تستلم منه نقدًا.',
            ),
          ],
        },
        {
          id: 'fees',
          heading: 'العمولة',
          blocks: [
            p(
              'تأخذ مزاد عمولة على كل بيع، نسبةً من سعر البيع. تحدد مزاد النسبة، وتُثبَّت لكل مزاد عند إنشائه أو الموافقة عليه. وإذا أُرجع منتج واستُرد مبلغه تُلغى عمولته.',
            ),
            p(
              'في الدفع بالبطاقة يصل المبلغ إلى حساب مزاد لدى SwiftPayIQ، ثم تحوّل لك مزاد حصتك بعد خصم العمولة، خارج التطبيق.',
            ),
            tbc('OD-3', 'نسبة العمولة، وأين تظهر للبائع قبل النشر.'),
            tbc('OD-5', 'متى وكيف تُحوَّل للبائع مستحقاته عن المبيعات المدفوعة بالبطاقة.'),
            tbc('OD-4', 'كيف يدفع البائع العمولة عن المبيعات المدفوعة نقدًا عند الاستلام.'),
          ],
        },
        {
          id: 'photos',
          heading: 'الصور',
          blocks: [
            p(
              'تعيد مزاد حفظ الصور التي ترفعها، فتُزال منها البيانات المخفية مثل موقع التصوير. وصور المنتجات تظهر للعامة في صفحة المزاد.',
            ),
          ],
        },
      ],
    },
    en: {
      title: 'Selling on Mazad',
      summary: 'How to list an item, what Mazad expects from sellers, and the commission.',
      sections: [
        {
          id: 'get-started',
          heading: 'Getting started',
          blocks: [
            p(
              'From your account open "Selling": create a store, add a product with at least one photo, then create an auction. A description in one language is enough.',
            ),
            ul(
              'The opening price is at least 1,000 IQD, in whole dinars.',
              'A buy-now price is optional and must be above the opening price.',
              'An auction runs from 1 hour to 14 days.',
              'The delivery fee comes from your store settings and is shown to bidders.',
            ),
          ],
        },
        {
          id: 'approval',
          heading: 'Review before publishing',
          blocks: [
            p(
              'Mazad may review listings before they appear; at the moment, auctions are reviewed before they go live. Mazad can reject a listing and tells you when it does.',
            ),
            p(
              'You can withdraw an auction while it is a draft, scheduled, awaiting approval, or live with no bids. After the first bid it can’t be withdrawn.',
            ),
          ],
        },
        {
          id: 'responsibilities',
          heading: 'Your responsibilities as a seller',
          blocks: [
            ul(
              'Only list items you own or are allowed to sell.',
              'Describe the item honestly, with real photos of the item itself and its true condition.',
              'Don’t list prohibited items.',
              'Deliver the item you described to the buyer’s address without delay.',
              'Use the buyer’s name, address and phone only to deliver the order.',
              'Handle return requests in good faith.',
            ),
            link(ROUTES.helpTopic('terms'), 'Terms, including the list of prohibited items'),
            tbc('OD-13', 'How long sellers have to confirm and deliver an order.'),
          ],
        },
        {
          id: 'orders',
          heading: 'Orders',
          blocks: [
            p(
              'When your auction sells, the order appears under "Orders received". Confirm it, mark it out for delivery when it leaves, and confirm delivery when the buyer has it. You can cancel an order only before you confirm it.',
            ),
            p(
              'For cash on delivery, enter the exact cash you received; it must equal the order total. If the buyer has already paid by card, don’t collect cash.',
            ),
          ],
        },
        {
          id: 'fees',
          heading: 'Commission',
          blocks: [
            p(
              'Mazad charges a commission on each sale, as a percentage of the sale price. Mazad sets the rate, and it is fixed for each auction when it is created or approved. If an item is returned and refunded, its commission is cancelled.',
            ),
            p(
              'For card payments, the money goes to Mazad’s SwiftPayIQ account; Mazad then pays you your share, less the commission, by transfer outside the app.',
            ),
            tbc('OD-3', 'The commission rate, and where sellers see it before publishing.'),
            tbc('OD-5', 'When and how sellers are paid for card sales.'),
            tbc('OD-4', 'How sellers pay the commission on cash-on-delivery sales.'),
          ],
        },
        {
          id: 'photos',
          heading: 'Photos',
          blocks: [
            p(
              'Mazad re-saves the photos you upload, which removes hidden data such as where the photo was taken. Product photos are public on the auction page.',
            ),
          ],
        },
      ],
    },
  },
  faq: {
    ar: {
      title: 'أسئلة شائعة',
      summary: 'أجوبة سريعة عن الحساب والمزايدة والطلبات.',
      sections: [
        {
          id: 'create-account',
          heading: 'كيف أنشئ حسابًا؟',
          blocks: [
            p(
              'سجّل برقم هاتفك واسمك وكلمة مرور. وللتأكد من أن الرقم لك نرسل رمزًا لمرة واحدة عبر بوت مزاد في تيليجرام: افتح البوت وشارك رقم هاتفك، فيصلك الرمز في تيليجرام.',
            ),
          ],
        },
        {
          id: 'forgot-password',
          heading: 'نسيت كلمة المرور',
          blocks: [
            p(
              'اختر «نسيت كلمة المرور؟» في صفحة تسجيل الدخول، وسنرسل لك رمز تحقق عبر بوت تيليجرام لتعيين كلمة مرور جديدة.',
            ),
          ],
        },
        {
          id: 'cancel-bid',
          heading: 'هل أستطيع إلغاء مزايدة؟',
          blocks: [
            p(
              'لا. المزايدة التزام، فزايد فقط بما تنوي دفعه. يمكنك إيقاف المزايدة التلقائية قبل أن تزايد مجددًا.',
            ),
          ],
        },
        {
          id: 'cant-bid',
          heading: 'لماذا لا أستطيع المزايدة؟',
          blocks: [
            p(
              'تأكد أنك مسجّل الدخول ولديك عنوان توصيل محفوظ، وأن المزاد ما زال مباشرًا، وأن مزايدتك تساوي الحد الأدنى المعروض أو أكثر. لا يمكنك المزايدة على مزاداتك، ولا إذا كان حسابك موقوفًا.',
            ),
          ],
        },
        {
          id: 'phone-visible',
          heading: 'هل رقم هاتفي ظاهر للآخرين؟',
          blocks: [
            p(
              'لا يظهر رقمك أو عنوانك للعامة. يرى البائع اسمك وعنوان التوصيل وهاتف التوصيل وموقع الخريطة فقط للطلبات التي اشتريتها منه، ليتمكن من إيصالها. ويطّلع عليها فريق مزاد لتشغيل الخدمة.',
            ),
          ],
        },
        {
          id: 'how-to-sell',
          heading: 'كيف أبيع على مزاد؟',
          blocks: [
            p(
              'من حسابك افتح «البيع»: أنشئ متجرًا، وأضف منتجًا بصورة واحدة على الأقل، ثم انشر مزادًا.',
            ),
            link(ROUTES.helpTopic('selling'), 'البيع على مزاد'),
          ],
        },
        {
          id: 'notifications',
          heading: 'كيف تصلني الإشعارات؟',
          blocks: [
            p(
              'تبلغك مزاد في قائمة الإشعارات بما يخص مزايداتك وفوزك وطلباتك ومدفوعاتك والإرجاع. ويرسل تطبيق أندرويد أيضًا إشعارات فورية، ويمكنك إيقافها من إعدادات هاتفك.',
            ),
          ],
        },
        {
          id: 'delete-account',
          heading: 'كيف أحذف حسابي؟',
          blocks: [
            p(
              'يمكنك حذف حسابك بنفسك من صفحة الحساب، بعد إنهاء التزاماتك المفتوحة، مثل طلب مفتوح أو مزايدة متصدّرة.',
            ),
            link(ACCOUNT_DELETION_PATH, 'ما يُحذف وما يُحتفظ به عند حذف الحساب'),
          ],
        },
        {
          id: 'contact',
          heading: 'كيف أتواصل مع مزاد؟',
          blocks: [
            p('لا توجد قناة دعم بعد. مشكلات الإرجاع تصل إلى مزاد تلقائيًا عبر طلب الإرجاع.'),
            SUPPORT_TBC.ar,
          ],
        },
      ],
    },
    en: {
      title: 'Help & FAQ',
      summary: 'Quick answers about your account, bidding and orders.',
      sections: [
        {
          id: 'create-account',
          heading: 'How do I create an account?',
          blocks: [
            p(
              'Sign up with your phone number, your name and a password. To check the number is yours, we send a one-time code through Mazad’s Telegram bot: open the bot and share your phone number, and the code arrives in Telegram.',
            ),
          ],
        },
        {
          id: 'forgot-password',
          heading: 'I forgot my password',
          blocks: [
            p(
              'Choose "Forgot password?" on the sign-in page. We send a verification code through the Telegram bot so you can set a new password.',
            ),
          ],
        },
        {
          id: 'cancel-bid',
          heading: 'Can I cancel a bid?',
          blocks: [
            p(
              'No. A bid is a commitment, so only bid what you intend to pay. You can stop an automatic bid before it bids again.',
            ),
          ],
        },
        {
          id: 'cant-bid',
          heading: 'Why can’t I bid?',
          blocks: [
            p(
              'Check that you are signed in and have a saved delivery address, that the auction is still live, and that your bid is at least the minimum shown. You can’t bid on your own auctions, or while your account is suspended.',
            ),
          ],
        },
        {
          id: 'phone-visible',
          heading: 'Is my phone number visible to others?',
          blocks: [
            p(
              'Your phone and address are never public. A seller sees your name, delivery address, delivery phone and map pin only for orders you bought from them, so they can deliver. Mazad’s staff can see them to run the service.',
            ),
          ],
        },
        {
          id: 'how-to-sell',
          heading: 'How do I sell on Mazad?',
          blocks: [
            p(
              'From your account open "Selling": create a store, add a product with at least one photo, then publish an auction.',
            ),
            link(ROUTES.helpTopic('selling'), 'Selling on Mazad'),
          ],
        },
        {
          id: 'notifications',
          heading: 'How do notifications work?',
          blocks: [
            p(
              'Mazad tells you about your bids, wins, orders, payments and returns in your notifications list. The Android app also sends push notifications, which you can turn off in your phone’s settings.',
            ),
          ],
        },
        {
          id: 'delete-account',
          heading: 'How do I delete my account?',
          blocks: [
            p(
              'You can delete your account yourself from the Account page, once your open business is finished, such as an open order or a leading bid.',
            ),
            link(ACCOUNT_DELETION_PATH, 'What deleting your account removes and keeps'),
          ],
        },
        {
          id: 'contact',
          heading: 'How do I contact Mazad?',
          blocks: [
            p(
              'There is no support channel yet. Return problems reach Mazad automatically through the return request.',
            ),
            SUPPORT_TBC.en,
          ],
        },
      ],
    },
  },
  privacy: {
    ar: {
      title: 'الخصوصية',
      summary: 'ما نجمعه، ولماذا، ومن يراه، وكم نحتفظ به.',
      isDraft: true,
      sections: [
        {
          id: 'about-this-policy',
          heading: 'عن هذه السياسة',
          blocks: [
            p(
              'تشمل هذه السياسة موقع مزاد الإلكتروني وتطبيقه على أندرويد. مزاد سوق مزادات إلكتروني في العراق.',
            ),
            tbc('OD-1', 'اسم الشركة أو الشخص المسؤول عن مزاد وعن بياناتك، وعنوانه.'),
          ],
        },
        {
          id: 'what-we-collect',
          heading: 'ما نجمعه',
          review: 'LR-6',
          blocks: [
            ul(
              'الحساب: اسمك ورقم هاتفك وكلمة المرور، ولا نخزن منها إلا صيغة مُجزّأة لا يمكن استرجاع الكلمة منها.',
              'التحقق من الهاتف: الربط بين رقم هاتفك وحسابك في تيليجرام، الذي يتم عندما تشارك رقمك مع بوت مزاد، والرموز التي نرسلها لمرة واحدة.',
              'العناوين: المدينة والمنطقة والشارع والتفاصيل ورقم هاتف للتوصيل، وموقع على الخريطة إن اخترت ذلك.',
              'البيع: اسم متجرك ومدينته وهاتف التواصل وعنوانه، والمنتجات والأوصاف والصور التي تضيفها.',
              'النشاط: المزايدات وحدود المزايدة التلقائية، والفوز، والطلبات، والمدفوعات، والإرجاع، والتقييمات، والمزادات المحفوظة، والبائعون الذين تتابعهم، وإشعاراتك.',
              'المدفوعات: طريقة الدفع والمبلغ والحالة ومرجع الدفعة لدى SwiftPayIQ، وليس بيانات بطاقتك أبدًا.',
              'الأجهزة والأمان: الأجهزة المسجّل دخولك عليها (اسم الجهاز ونظامه وعنوان IP)، ورمز الإشعارات الفورية في تطبيق أندرويد، وسجلات أمان للإجراءات المهمة تتضمن عناوين IP.',
            ),
          ],
        },
        {
          id: 'why',
          heading: 'لماذا نستخدمه',
          review: 'LR-6',
          blocks: [
            ul(
              'لإنشاء حسابك وحمايته والتحقق من رقم هاتفك.',
              'لتشغيل المزادات وإنشاء الطلبات وتوصيلها.',
              'لاستلام المدفوعات ورد المبالغ.',
              'لإرسال إشعارات عن مزايداتك وطلباتك وحسابك.',
              'لمنع الاحتيال وإساءة الاستخدام، وتطبيق الشروط، ومراجعة الإعلانات.',
              'للاحتفاظ بالسجلات التي تتطلبها المحاسبة والقانون.',
            ),
            tbc('LR-6', 'الأساس القانوني لكل استخدام، وحقوقك بموجب القانون الذي ينطبق على مزاد.'),
          ],
        },
        {
          id: 'who-sees-it',
          heading: 'من يرى بياناتك',
          review: 'LR-6',
          blocks: [
            ul(
              'الجميع: الإعلانات وصور المنتجات وأسماء المتاجر ومدنها، والتقييمات باسم مختصر للمقيّم مثل «أحمد ك.»، والمزايدات باسم مستعار للمزايد.',
              'بائع طلبك: اسمك وعنوان التوصيل وموقع الخريطة وهاتف التوصيل، للطلبات وطلبات الإرجاع التي بينكما فقط.',
              'فريق مزاد: تفاصيل الحسابات والطلبات والمدفوعات والإرجاع، لتشغيل الخدمة ومراجعة المحتوى وحل المشكلات.',
            ),
            p('لا نبيع بياناتك الشخصية.'),
          ],
        },
        {
          id: 'service-providers',
          heading: 'مزوّدو الخدمات',
          review: 'LR-6',
          blocks: [
            p('تعالج هذه الجهات بعض بياناتك لتقديم أجزاء من خدمة مزاد:'),
            ul(
              'Railway: تستضيف خوادمنا وقاعدة البيانات والصور المرفوعة.',
              'Firebase Cloud Messaging من Google: يوصل الإشعارات الفورية إلى تطبيق أندرويد، باستخدام رمز الإشعارات لجهازك ونص الإشعار.',
              'تيليجرام: يوصل رموز التحقق عبر بوت مزاد. وتنطبق سياسة خصوصية تيليجرام على استخدامك له.',
              'SwiftPayIQ: يعالج الدفع بالبطاقة. يستلم مبلغ الدفعة ومرجع الطلب، ورقم هاتفك في بعض أنواع الدفع، وتُدخل بيانات بطاقتك لديه مباشرة.',
              'Google Fonts: يحمّل الموقع الإلكتروني خطه من Google، فيصلها عنوان IP لمتصفحك.',
              'OpenFreeMap: يوفر الخريطة في تطبيق أندرويد عند تحديد موقع، فيحمّل هاتفك صور الخريطة للمنطقة التي تعرضها.',
            ),
            tbc(
              'OD-11',
              'القائمة النهائية الكاملة لمزوّدي الخدمات، ومنهم مستضيف الموقع الإلكتروني، والدول التي تُخزَّن فيها البيانات.',
            ),
          ],
        },
        {
          id: 'location',
          heading: 'الموقع',
          blocks: [
            p(
              'لا يطلب تطبيق أندرويد موقعك إلا عندما تضغط «استخدام موقعي الحالي» أو «موقعي» أثناء تحديد عنوان، ولا يتتبع موقعك في الخلفية. يُحفظ الموقع الذي تحدده مع العنوان، ولا يراه إلا بائع الطلب المرسَل إلى هذا العنوان وفريق مزاد. والموقع الإلكتروني لا يطلب موقعك.',
            ),
          ],
        },
        {
          id: 'photos',
          heading: 'الصور',
          blocks: [
            p(
              'تعيد مزاد حفظ الصور التي ترفعها، فتُزال منها البيانات المخفية مثل موقع التصوير وإعدادات الكاميرا. وصور المنتجات علنية.',
            ),
          ],
        },
        {
          id: 'notifications',
          heading: 'الإشعارات',
          blocks: [
            p(
              'نحفظ إشعاراتك في حسابك. وتستخدم الإشعارات الفورية على أندرويد خدمة Firebase Cloud Messaging، ويمكنك إيقافها من إعدادات هاتفك. ويُحذف رمز الإشعارات عند حذف حسابك.',
            ),
          ],
        },
        {
          id: 'browser-storage',
          heading: 'على الموقع الإلكتروني',
          blocks: [
            p(
              'يُبقيك الموقع مسجّل الدخول ويتذكر لغتك ومظهر العرض باستخدام التخزين المحلي في متصفحك. ولا نستخدم أدوات تتبع إعلانية أو تحليلية.',
            ),
          ],
        },
        {
          id: 'retention',
          heading: 'مدة الاحتفاظ',
          review: 'LR-6',
          blocks: [
            p(
              'نحتفظ ببياناتك ما دام حسابك مفتوحًا. عند حذف حسابك تُحذف بياناتك الشخصية أو تُجهَّل، لكن الطلبات والمزايدات والمدفوعات والإرجاع والتقييمات وسجلات الأمان تبقى دون اسمك، لأن الطرف الآخر وحساباتنا يحتاجان إليها. ونحتفظ بصيغة مُجزّأة لا يمكن عكسها من رقم هاتفك لمنع إنشاء حساب جديد بالرقم نفسه مدة 30 يومًا.',
            ),
            link(ACCOUNT_DELETION_PATH, 'ما يُحذف وما يُحتفظ به عند حذف الحساب'),
            tbc('OD-10', 'مدة الاحتفاظ بكل نوع من البيانات، وما يحدث للحسابات غير النشطة.'),
          ],
        },
        {
          id: 'your-choices',
          heading: 'خياراتك',
          blocks: [
            p(
              'يمكنك تعديل عناوينك وبيانات حسابك من التطبيق أو الموقع الإلكتروني، وحذف حسابك في أي وقت بعد إنهاء التزاماتك المفتوحة.',
            ),
          ],
        },
        {
          id: 'security',
          heading: 'الأمان',
          blocks: [
            p(
              'نستخدم اتصالات مشفّرة (HTTPS)، ونخزن كلمات المرور بصيغة مُجزّأة فقط. ولا توجد خدمة إلكترونية آمنة تمامًا.',
            ),
          ],
        },
        {
          id: 'children',
          heading: 'الأطفال',
          blocks: [tbc('OD-12', 'الحد الأدنى لعمر مستخدمي مزاد.')],
        },
        {
          id: 'changes',
          heading: 'التغييرات',
          blocks: [p('سنحدّث هذه الصفحة عندما تتغير ممارساتنا.')],
        },
        {
          id: 'contact',
          heading: 'التواصل',
          blocks: [SUPPORT_TBC.ar],
        },
      ],
    },
    en: {
      title: 'Privacy',
      summary: 'What we collect, why, who sees it and how long we keep it.',
      isDraft: true,
      sections: [
        {
          id: 'about-this-policy',
          heading: 'About this policy',
          blocks: [
            p(
              'This policy covers the Mazad website and Android app. Mazad is an online auction marketplace in Iraq.',
            ),
            tbc(
              'OD-1',
              'The name and address of the company or person responsible for Mazad and your data.',
            ),
          ],
        },
        {
          id: 'what-we-collect',
          heading: 'What we collect',
          review: 'LR-6',
          blocks: [
            ul(
              'Account: your name, phone number and password. We store only a one-way hash of the password, never the password itself.',
              'Phone verification: the link between your phone number and your Telegram account, made when you share your number with Mazad’s Telegram bot, and the one-time codes we send.',
              'Addresses: city, area, street, details, a delivery phone number and, if you choose, a pin on the map.',
              'Selling: your store’s name, city, contact phone and address, and the products, descriptions and photos you add.',
              'Activity: bids and automatic-bid limits, wins, orders, payments, returns, reviews, saved auctions, sellers you follow, and your notifications.',
              'Payments: the method, amount, status and SwiftPayIQ’s payment reference. Never your card details.',
              'Devices and security: the devices you are signed in on (device name, platform and IP address), the Android app’s push notification token, and security records of important actions, which include IP addresses.',
            ),
          ],
        },
        {
          id: 'why',
          heading: 'Why we use it',
          review: 'LR-6',
          blocks: [
            ul(
              'To create and protect your account and verify your phone number.',
              'To run auctions, and to create and deliver orders.',
              'To take payments and make refunds.',
              'To send you notifications about your bids, orders and account.',
              'To prevent fraud and abuse, enforce our Terms and review listings.',
              'To keep the records that accounting and the law require.',
            ),
            tbc(
              'LR-6',
              'The legal basis for each use, and your rights under the law that applies to Mazad.',
            ),
          ],
        },
        {
          id: 'who-sees-it',
          heading: 'Who sees your data',
          review: 'LR-6',
          blocks: [
            ul(
              'Everyone: listings, product photos, store names and cities, reviews (with a short version of the reviewer’s name, like "Ahmed K.") and bids (with an anonymous bidder label).',
              'The seller of your order: your name, delivery address, map pin and delivery phone, only for orders and returns between you.',
              'Mazad’s staff: account, order, payment and return details, to run the service, review content and resolve problems.',
            ),
            p('We don’t sell your personal data.'),
          ],
        },
        {
          id: 'service-providers',
          heading: 'Service providers',
          review: 'LR-6',
          blocks: [
            p('These companies process some of your data to provide parts of Mazad:'),
            ul(
              'Railway: hosts our servers, database and uploaded photos.',
              'Firebase Cloud Messaging (Google): delivers push notifications to the Android app, using your device’s push token and the notification text.',
              'Telegram: delivers verification codes through Mazad’s Telegram bot. Telegram’s own privacy policy applies to your use of Telegram.',
              'SwiftPayIQ: processes card payments. It receives the payment amount and the order reference, and for some payment types your phone number; you give your card details directly to it.',
              'Google Fonts: the website loads its font from Google, which receives your browser’s IP address.',
              'OpenFreeMap: provides the map in the Android app when you pin a location; your phone downloads map images of the area you view.',
            ),
            tbc(
              'OD-11',
              'The full, final list of providers, including who hosts the website, and the countries where data is stored.',
            ),
          ],
        },
        {
          id: 'location',
          heading: 'Location',
          blocks: [
            p(
              'The Android app asks for your location only when you tap "Use my current location" or "My location" while setting an address, and never tracks it in the background. A pin you save is stored with that address and seen only by the seller of an order sent to it and by Mazad’s staff. The website doesn’t ask for your location.',
            ),
          ],
        },
        {
          id: 'photos',
          heading: 'Photos',
          blocks: [
            p(
              'Mazad re-saves the photos you upload, which strips hidden data such as where the photo was taken and the camera settings. Product photos are public.',
            ),
          ],
        },
        {
          id: 'notifications',
          heading: 'Notifications',
          blocks: [
            p(
              'We keep your notifications in your account. Push notifications on Android use Firebase Cloud Messaging; you can turn them off in your phone’s settings. Your push token is removed when you delete your account.',
            ),
          ],
        },
        {
          id: 'browser-storage',
          heading: 'On the website',
          blocks: [
            p(
              'The website keeps you signed in, and remembers your language and theme, using your browser’s local storage. We don’t use advertising or analytics trackers.',
            ),
          ],
        },
        {
          id: 'retention',
          heading: 'How long we keep data',
          review: 'LR-6',
          blocks: [
            p(
              'We keep your data while your account is open. When you delete your account, your personal details are removed or anonymised, but orders, bids, payments, returns, reviews and security records are kept without your name, because the other party and our accounting need them. A one-way hash of your phone number is kept to stop the same number from opening a new account for 30 days.',
            ),
            link(ACCOUNT_DELETION_PATH, 'What deleting your account removes and keeps'),
            tbc(
              'OD-10',
              'How long each kind of data is kept, and what happens to inactive accounts.',
            ),
          ],
        },
        {
          id: 'your-choices',
          heading: 'Your choices',
          blocks: [
            p(
              'You can change your addresses and account details in the app or on the website, and delete your account at any time once your open business is finished.',
            ),
          ],
        },
        {
          id: 'security',
          heading: 'Security',
          blocks: [
            p(
              'We use encrypted connections (HTTPS) and store passwords only as one-way hashes. No online service is completely secure.',
            ),
          ],
        },
        {
          id: 'children',
          heading: 'Children',
          blocks: [tbc('OD-12', 'The minimum age to use Mazad.')],
        },
        {
          id: 'changes',
          heading: 'Changes',
          blocks: [p('We’ll update this page when our practices change.')],
        },
        {
          id: 'contact',
          heading: 'Contact',
          blocks: [SUPPORT_TBC.en],
        },
      ],
    },
  },
  terms: {
    ar: {
      title: 'الشروط والأحكام',
      summary: 'قواعد البيع والشراء على مزاد.',
      isDraft: true,
      sections: [
        {
          id: 'about-mazad',
          heading: 'ما هي مزاد',
          review: 'LR-1',
          blocks: [
            p(
              'توفر مزاد منصة إلكترونية، هي الموقع الإلكتروني وتطبيق أندرويد، يعرض فيها البائعون، أفرادًا ومتاجر، منتجاتهم الخاصة للمزاد ويزايد عليها المشترون. مزاد ليست البائع: كل عملية بيع تتم بين المشتري والبائع، والبائع مسؤول عن المنتج وتوصيله.',
            ),
            tbc('OD-1', 'اسم الشركة أو الشخص الذي يشغّل مزاد، وعنوانه ورقم تسجيله.'),
          ],
        },
        {
          id: 'your-account',
          heading: 'حسابك',
          blocks: [
            ul(
              'استخدم رقم هاتفك أنت، وتحقق منه بالرمز الذي يصلك عبر تيليجرام.',
              'قدّم بيانات صحيحة، ومنها عناوين التوصيل.',
              'حافظ على سرية كلمة المرور، فأنت مسؤول عما يجري في حسابك.',
            ),
            tbc('OD-12', 'الحد الأدنى لعمر مستخدمي مزاد.'),
          ],
        },
        {
          id: 'bidding-and-buying',
          heading: 'المزايدة والشراء',
          review: 'LR-9',
          blocks: [
            ul(
              'المزايدة عرض ملزم بالشراء بسعرها إذا فزت، ولا يمكن سحبها.',
              'المزايدات التي تقدمها المزايدة التلقائية عنك ملزمة بالطريقة نفسها.',
              'الشراء الفوري ينهي المزاد، وتشتري بسعر الشراء الفوري.',
              'قد يُمدَّد المزاد عند وصول مزايدة متأخرة.',
              'عند فوزك يُنشأ الطلب تلقائيًا إلى عنوانك الافتراضي، وتدفع السعر مع رسوم التوصيل.',
              'يمكنك إلغاء الطلب فقط قبل أن يؤكده البائع.',
            ),
            link(ROUTES.helpTopic('how-auctions-work'), 'كيف تعمل المزادات'),
          ],
        },
        {
          id: 'payment',
          heading: 'الدفع',
          review: 'LR-5',
          blocks: [
            p(
              'تدفع نقدًا عند الاستلام، أو بالبطاقة عبر SwiftPayIQ حيث يتوفر، وتنطبق شروط SwiftPayIQ على الدفع بالبطاقة. في الدفع بالبطاقة تستلم مزاد المبلغ في حسابها لدى SwiftPayIQ، ثم تحوّل للبائع حصته بعد خصم العمولة.',
            ),
          ],
        },
        {
          id: 'sellers',
          heading: 'البائعون',
          review: 'LR-10',
          blocks: [
            p('على البائع:'),
            ul(
              'أن يعرض فقط ما يملكه أو يحق له بيعه.',
              'أن يصف المنتج بصدق، بصور حقيقية وحالته الفعلية.',
              'أن يوصل المنتج الموصوف إلى عنوان المشتري.',
              'أن يلتزم بالقوانين التي تنطبق على ما يبيعه.',
              'أن يستخدم بيانات المشتري للتوصيل فقط.',
            ),
            tbc(
              'LR-10',
              'التزامات البائع بموجب القانون العراقي، مثل الضرائب والتراخيص وحماية المستهلك.',
            ),
          ],
        },
        {
          id: 'fees',
          heading: 'الرسوم',
          blocks: [
            p(
              'تأخذ مزاد من البائع عمولة على كل بيع، نسبةً من سعر البيع تحددها مزاد. ولا تفرض مزاد رسومًا على المشترين.',
            ),
            tbc('OD-3', 'نسبة العمولة، وأين تظهر للبائع قبل النشر.'),
          ],
        },
        {
          id: 'prohibited-items',
          heading: 'المنتجات المحظورة',
          review: 'LR-2',
          blocks: [
            p('يُمنع عرض:'),
            ul(
              'المنتجات غير القانونية، أو التي يقيّد القانون بيعها دون ترخيص.',
              'الأسلحة والذخيرة والمتفجرات وأجزاؤها.',
              'المخدرات وأدوات تعاطيها، والأدوية التي تحتاج إلى وصفة طبية.',
              'الكحول ومنتجات التبغ.',
              'المنتجات المقلدة، أو التي تنتهك حقوق الملكية الفكرية.',
              'المسروقات.',
              'المحتوى الإباحي.',
              'الحيوانات الحية.',
              'المواد الخطرة، مثل المواد الكيميائية أو القابلة للاشتعال أو السامة.',
              'الوثائق الرسمية وبطاقات الهوية والبيانات الشخصية والحسابات الإلكترونية.',
              'العملات المزيفة.',
              'المنتجات المسحوبة من السوق أو غير الآمنة.',
            ),
            p('قد تزيل مزاد هذه الإعلانات وتتخذ إجراءً بحق الحساب.'),
          ],
        },
        {
          id: 'moderation',
          heading: 'الإشراف',
          review: 'LR-8',
          blocks: [
            p('للحفاظ على أمان السوق، يجوز لمزاد:'),
            ul(
              'مراجعة الإعلانات قبل نشرها، ورفضها.',
              'حظر المنتجات.',
              'تعليق المتاجر.',
              'حظر الحسابات.',
            ),
            p(
              'عند حظر منتج أو تعليق متجر أو حظر بائع تُسحب إعلاناته من البيع، ومنها المزادات الجارية، ويُبلَّغ المزايدون عليها. وتُلغى الطلبات التي لم يؤكدها البائع بعد، وتتولى مزاد الطلبات التي في طريقها إلى المشتري.',
            ),
            p('يُحظر الحساب تلقائيًا عند تكرار خسارة الفوز بسبب عدم وجود عنوان توصيل.'),
          ],
        },
        {
          id: 'returns-and-disputes',
          heading: 'الإرجاع والخلافات',
          review: 'LR-4',
          blocks: [
            p(
              'يمكن للمشتري طلب الإرجاع خلال 7 أيام من التسليم، ويمكن لمزاد مراجعة أي طلب إرجاع والبت فيه داخل المنصة.',
            ),
            link(ROUTES.helpTopic('returns'), 'كيف يعمل الإرجاع'),
            tbc(
              'LR-4',
              'كيفية التعامل مع الخلافات الأخرى بين المشترين والبائعين، والقانون والمحاكم المختصة.',
            ),
          ],
        },
        {
          id: 'liability',
          heading: 'المسؤولية',
          review: 'LR-3',
          blocks: [
            p(
              'تدير مزاد المنصة بعناية، لكنها لا تفحص المنتجات المعروضة ولا تملكها ولا تضمنها، وليست مسؤولة عن وصف البائع أو جودة المنتج أو قانونيته أو توصيله، إلا حيث ينص القانون على غير ذلك.',
            ),
            p(
              'لا تتحمل مزاد مسؤولية الخسائر غير المباشرة، ولا انقطاع الخدمة لأسباب خارجة عن سيطرتها المعقولة. ولا شيء في هذه الشروط يحدّ من حقوقك التي يكفلها القانون.',
            ),
          ],
        },
        {
          id: 'closing-your-account',
          heading: 'إغلاق الحساب',
          review: 'LR-8',
          blocks: [
            p(
              'يمكنك حذف حسابك في أي وقت بعد إنهاء التزاماتك المفتوحة، وتشرح صفحة حذف الحساب ما يُحتفظ به. ويجوز لمزاد إيقاف الحسابات التي تخالف هذه الشروط.',
            ),
            link(ACCOUNT_DELETION_PATH, 'حذف الحساب'),
          ],
        },
        {
          id: 'changes',
          heading: 'تعديل الشروط',
          review: 'LR-7',
          blocks: [
            p(
              'يجوز لمزاد تعديل هذه الشروط. سننشر النسخة الجديدة هنا، ونبلغك بالتغييرات المهمة في التطبيق قبل سريانها.',
            ),
          ],
        },
        {
          id: 'contact',
          heading: 'التواصل',
          blocks: [SUPPORT_TBC.ar],
        },
      ],
    },
    en: {
      title: 'Terms',
      summary: 'The rules for buying and selling on Mazad.',
      isDraft: true,
      sections: [
        {
          id: 'about-mazad',
          heading: 'What Mazad is',
          review: 'LR-1',
          blocks: [
            p(
              'Mazad provides an online platform, the website and the Android app, where sellers, both individuals and stores, list their own items for auction and buyers bid on them. Mazad isn’t the seller: each sale is between the buyer and the seller, and the seller is responsible for the item and its delivery.',
            ),
            tbc(
              'OD-1',
              'The name, address and registration number of the company or person that runs Mazad.',
            ),
          ],
        },
        {
          id: 'your-account',
          heading: 'Your account',
          blocks: [
            ul(
              'Use your own phone number, and verify it with the code you get through Telegram.',
              'Give accurate details, including delivery addresses.',
              'Keep your password secret: you are responsible for what happens on your account.',
            ),
            tbc('OD-12', 'The minimum age to use Mazad.'),
          ],
        },
        {
          id: 'bidding-and-buying',
          heading: 'Bidding and buying',
          review: 'LR-9',
          blocks: [
            ul(
              'A bid is a binding offer to buy at that price if you win, and it can’t be withdrawn.',
              'Bids that automatic bidding places for you are binding in the same way.',
              'Buy now ends the auction, and you buy at the buy-now price.',
              'A late bid can extend the auction.',
              'When you win, an order is created automatically to your default address, and you pay the price plus the delivery fee.',
              'You can cancel an order only before the seller confirms it.',
            ),
            link(ROUTES.helpTopic('how-auctions-work'), 'How auctions work'),
          ],
        },
        {
          id: 'payment',
          heading: 'Payment',
          review: 'LR-5',
          blocks: [
            p(
              'You pay cash on delivery, or by card through SwiftPayIQ where available; SwiftPayIQ’s terms also apply to card payments. For card payments, Mazad receives the money in its SwiftPayIQ account and then pays the seller their share, less the commission.',
            ),
          ],
        },
        {
          id: 'sellers',
          heading: 'Sellers',
          review: 'LR-10',
          blocks: [
            p('Sellers must:'),
            ul(
              'only list items they own or are allowed to sell;',
              'describe each item honestly, with real photos and its true condition;',
              'deliver the item they described to the buyer’s address;',
              'follow the laws that apply to what they sell;',
              'use the buyer’s details only for delivery.',
            ),
            tbc(
              'LR-10',
              'Seller obligations under Iraqi law, such as taxes, licences and consumer protection.',
            ),
          ],
        },
        {
          id: 'fees',
          heading: 'Fees',
          blocks: [
            p(
              'Mazad charges sellers a commission on each sale, a percentage of the sale price that Mazad sets. Mazad doesn’t charge buyers a fee.',
            ),
            tbc('OD-3', 'The commission rate, and where sellers see it before publishing.'),
          ],
        },
        {
          id: 'prohibited-items',
          heading: 'Prohibited items',
          review: 'LR-2',
          blocks: [
            p('You may not list:'),
            ul(
              'illegal items, or items the law only allows to be sold with a licence;',
              'weapons, ammunition and explosives, and their parts;',
              'drugs and drug paraphernalia, and prescription medicines;',
              'alcohol and tobacco products;',
              'counterfeits, or items that infringe intellectual property rights;',
              'stolen goods;',
              'adult or sexual content;',
              'live animals;',
              'hazardous materials, such as chemicals, flammable or toxic substances;',
              'official documents, ID cards, personal data and online accounts;',
              'counterfeit money;',
              'recalled or unsafe products.',
            ),
            p('Mazad may remove such listings and take action against the account.'),
          ],
        },
        {
          id: 'moderation',
          heading: 'Moderation',
          review: 'LR-8',
          blocks: [
            p('To keep the marketplace safe, Mazad may:'),
            ul(
              'review listings before they go live, and reject them;',
              'block products;',
              'suspend stores;',
              'ban accounts.',
            ),
            p(
              'When a product is blocked, a store suspended or a seller banned, their listings are withdrawn from sale, including running auctions, and bidders are told. Orders the seller hasn’t confirmed yet are cancelled, and Mazad handles orders already on their way.',
            ),
            p(
              'An account is banned automatically after repeated lost wins because the winner had no delivery address.',
            ),
          ],
        },
        {
          id: 'returns-and-disputes',
          heading: 'Returns and disputes',
          review: 'LR-4',
          blocks: [
            p(
              'Buyers can request a return within 7 days of delivery, and Mazad can review and decide any return request on the platform.',
            ),
            link(ROUTES.helpTopic('returns'), 'How returns work'),
            tbc(
              'LR-4',
              'How other disputes between buyers and sellers are handled, and which law and courts apply.',
            ),
          ],
        },
        {
          id: 'liability',
          heading: 'Liability',
          review: 'LR-3',
          blocks: [
            p(
              'Mazad runs the platform with care, but it doesn’t inspect, own or guarantee the items listed, and isn’t responsible for a seller’s description, an item’s quality or legality, or its delivery, except where the law says otherwise.',
            ),
            p(
              'Mazad isn’t liable for indirect losses, or for interruptions of the service caused by events beyond its reasonable control. Nothing in these terms limits rights you have by law.',
            ),
          ],
        },
        {
          id: 'closing-your-account',
          heading: 'Closing your account',
          review: 'LR-8',
          blocks: [
            p(
              'You can delete your account at any time once your open business is finished; the account deletion page explains what is kept. Mazad may suspend accounts that break these terms.',
            ),
            link(ACCOUNT_DELETION_PATH, 'Delete your account'),
          ],
        },
        {
          id: 'changes',
          heading: 'Changes to these terms',
          review: 'LR-7',
          blocks: [
            p(
              'Mazad may change these terms. We’ll publish the new version here and tell you about important changes in the app before they apply.',
            ),
          ],
        },
        {
          id: 'contact',
          heading: 'Contact',
          blocks: [SUPPORT_TBC.en],
        },
      ],
    },
  },
};
