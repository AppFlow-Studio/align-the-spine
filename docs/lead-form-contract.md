# LeadForm props contract (ATS-030)

`components/ui/lead-form.tsx` is the single config-driven form engine for every
lead form on the site. Page tickets consume it via the variant presets in
`content/lead-forms.ts` — do not build one-off forms.

## Quick start

```tsx
import { LeadForm } from "@/components/ui/lead-form";
import { leadFormVariants } from "@/content/lead-forms";

<LeadForm heading="Schedule Your Evaluation" {...leadFormVariants.heroEval} />;
```

Inside a Hero, pass fields through `HeroProps["form"]` instead (defaults to the
hero-eval variant when `fields` is omitted):

```tsx
<Hero form={{ heading, submitLabel, fields: leadFormVariants.carAccident.fields }} ... />
```

## `LeadFormProps`

| Prop             | Type                                        | Required | Notes                                                                                              |
| ---------------- | ------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `heading`        | `string`                                    | yes      | Rendered as an `<h2>` above the fields.                                                            |
| `fields`         | `LeadFieldConfig[]`                         | yes      | Drives both rendering and the derived zod schema.                                                  |
| `submitLabel`    | `string`                                    | yes      | CTA text on the submit button.                                                                     |
| `onSubmit`       | `(values: LeadFormValues) => Promise<void>` | no       | ATS-031 injects the real endpoint + success route here. Without it, submit simulates a 400ms call. |
| `successMessage` | `string`                                    | no       | Defaults to "Thanks — we'll be in touch shortly."                                                  |
| `fieldVariant`   | `"dark" \| "light"`                         | no       | Field styling surface; defaults to `"dark"` (hero panels).                                         |
| `className`      | `string`                                    | no       | Merged onto the `<form>`.                                                                          |

`LeadFormValues` is `Record<string, string>` keyed by each field's `name`.

## `LeadFieldConfig`

| Key            | Type                                                            | Default  | Notes                                                                 |
| -------------- | --------------------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| `name`         | `string`                                                        | —        | Key in the submitted values object.                                   |
| `label`        | `string`                                                        | —        | Visible field label.                                                  |
| `type`         | `"text" \| "tel" \| "email" \| "zip" \| "select" \| "textarea"` | `"text"` | `zip` renders a numeric text input with ZIP validation.               |
| `required`     | `boolean`                                                       | `true`   | Optional fields still format-validate (tel/email/zip) when filled in. |
| `half`         | `boolean`                                                       | `false`  | Half-width fields pair up side by side in the two-column grid.        |
| `options`      | `{ label: string; value: string }[]`                            | —        | Required for `type: "select"`.                                        |
| `placeholder`  | `string`                                                        | —        | For selects this becomes the disabled first option.                   |
| `autoComplete` | `string`                                                        | —        | Forwarded to the input.                                               |

## Variant presets (`content/lead-forms.ts`)

Each preset is `{ fields, submitLabel }`; spread it into `<LeadForm />`.

| Variant       | Fields                                                             | Submit label                        |
| ------------- | ------------------------------------------------------------------ | ----------------------------------- |
| `heroEval`    | First, Last, Phone, Email                                          | Schedule My Evaluation              |
| `carAccident` | hero-eval + Claim # (optional)                                     | Schedule My Car Accident Evaluation |
| `contact`     | hero-eval + Zip, Best Time to Contact (select), Message (textarea) | Contact Us                          |
| `eligibility` | hero-eval + Zip                                                    | Check Eligibility                   |

## Validation & states

- Schema per variant is derived from its fields config via
  `buildLeadFormSchema` (zod + `@hookform/resolvers`): required fields must be
  non-empty ("Required"), and tel/email/zip enforce a format.
- Errors render inline under each field through the ATS-021 primitives
  (`Input` / `Select` / `Textarea`), with `aria-invalid` + `aria-describedby`.
- Submit button shows a loading spinner and is disabled while submitting; a
  failed `onSubmit` renders a retryable error line, success resets the form and
  shows `successMessage`.

## Spam guard

A visually hidden "website" honeypot input sits outside react-hook-form. If a
bot fills it, the form fakes success and never calls `onSubmit`.
