"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

type AdminTab = "services" | "events" | "articles" | "gallery" | "settings";
type GalleryImage = { src: string; alt: string; caption?: string };
type AdminRecord = Record<string, unknown> & {
  seo?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  socialLinks?: Record<string, unknown>;
};

interface AdminRecordFormProps {
  tab: AdminTab;
  initialData: AdminRecord;
  onSave: (data: AdminRecord) => void;
  onCancel?: () => void;
  isPending: boolean;
}

const selectOptions: Record<string, { label: string; value: string }[]> = {
  status: [
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
    { label: "Cancelled", value: "cancelled" },
  ],
};

export function AdminRecordForm({
  tab,
  initialData,
  onSave,
  onCancel,
  isPending,
}: AdminRecordFormProps) {
  const [formData, setFormData] = useState<AdminRecord>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const setField = (key: string, value: unknown) =>
    setFormData((previous) => ({ ...previous, [key]: value }));

  const setNested = (parent: "seo" | "contact" | "socialLinks", key: string, value: unknown) =>
    setFormData((previous) => ({
      ...previous,
      [parent]: { ...(isRecord(previous[parent]) ? previous[parent] : {}), [key]: value },
    }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave(formData);
  };

  const textField = (label: string, key: string, options: { type?: string; placeholder?: string } = {}) => (
    <Field id={key} label={label}>
      <Input
        id={key}
        type={options.type ?? "text"}
        value={textValue(formData[key])}
        onChange={(event) => setField(key, event.target.value)}
        placeholder={options.placeholder}
      />
    </Field>
  );

  const textAreaField = (label: string, key: string, placeholder = "") => (
    <Field id={key} label={label}>
      <Textarea
        id={key}
        rows={4}
        value={textValue(formData[key])}
        onChange={(event) => setField(key, event.target.value)}
        placeholder={placeholder}
      />
    </Field>
  );

  const selectField = (label: string, key: string, options: { label: string; value: string }[]) => (
    <Field id={key} label={label}>
      <div className="relative">
        <Select id={key} value={textValue(formData[key])} onChange={(event) => setField(key, event.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-ink/50"
        >
          ▾
        </span>
      </div>
    </Field>
  );

  const boolField = (label: string, key: string) => (
    <label className="flex items-center gap-3 py-1 text-sm font-medium text-brand-purple" htmlFor={key}>
      <input
        id={key}
        type="checkbox"
        checked={Boolean(formData[key])}
        onChange={(event) => setField(key, event.target.checked)}
        className="h-4 w-4 rounded-sm border border-brand-purple/30 accent-brand-teal"
      />
      {label}
    </label>
  );

  const images = toGalleryImages(formData.images);
  const updateImage = (index: number, patch: Partial<GalleryImage>) =>
    setField(
      "images",
      serializeGalleryImages(images.map((image, position) => (position === index ? { ...image, ...patch } : image))),
    );
  const addImage = () => setField("images", serializeGalleryImages([...images, { src: "", alt: "" }]));
  const removeImage = (index: number) =>
    setField(
      "images",
      serializeGalleryImages(images.filter((_, position) => position !== index)),
    );

  const renderImages = () => (
    <div className="space-y-4 border border-brand-purple/10 bg-brand-paper/40 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-purple/70">Gallery images</h4>
        <span className="text-xs font-medium text-brand-ink/55">
          {images.length} image{images.length === 1 ? "" : "s"}
        </span>
      </div>

      {images.length === 0 ? (
        <p className="text-sm leading-6 text-brand-ink/70">
          No images yet. Add at least one image before publishing this gallery item.
        </p>
      ) : (
        <ul className="space-y-3">
          {images.map((image, index) => (
            <li className="space-y-3 border border-brand-purple/10 bg-white p-4" key={index}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-ink/50">
                  Image {index + 1}
                </p>
                <button
                  className="text-xs font-bold text-red-700 transition-colors hover:text-red-800 hover:underline"
                  onClick={() => removeImage(index)}
                  type="button"
                >
                  Remove
                </button>
              </div>
              <Field id={`gallery-image-${index}-src`} label="Image URL">
                <Input
                  id={`gallery-image-${index}-src`}
                  value={image.src}
                  onChange={(event) => updateImage(index, { src: event.target.value })}
                  placeholder="/images/example.jpg"
                />
              </Field>
              <Field id={`gallery-image-${index}-alt`} label="Alt text">
                <Input
                  id={`gallery-image-${index}-alt`}
                  value={image.alt}
                  onChange={(event) => updateImage(index, { alt: event.target.value })}
                  placeholder="Describe the image for screen readers"
                />
              </Field>
              <Field id={`gallery-image-${index}-caption`} label="Caption (optional)">
                <Input
                  id={`gallery-image-${index}-caption`}
                  value={image.caption ?? ""}
                  onChange={(event) => updateImage(index, { caption: event.target.value })}
                  placeholder="Shown beneath the image"
                />
              </Field>
            </li>
          ))}
        </ul>
      )}

      <Button onClick={addImage} size="sm" type="button" variant="outline">
        {images.length === 0 ? "Add image" : "Add another image"}
      </Button>
    </div>
  );

  const renderSeo = () => (
    <div className="space-y-4 border border-brand-purple/10 bg-brand-paper/40 p-4 sm:p-5">
      <h4 className="text-xs font-bold uppercase tracking-widest text-brand-purple/70">SEO</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="seo-title" label="Meta title">
          <Input
            id="seo-title"
            value={textValue(formData.seo?.title)}
            onChange={(event) => setNested("seo", "title", event.target.value)}
          />
        </Field>
        <Field id="seo-canonical" label="Canonical URL">
          <Input
            id="seo-canonical"
            value={textValue(formData.seo?.canonicalUrl)}
            onChange={(event) => setNested("seo", "canonicalUrl", event.target.value)}
          />
        </Field>
      </div>
      <Field id="seo-description" label="Meta description">
        <Textarea
          id="seo-description"
          rows={2}
          value={textValue(formData.seo?.description)}
          onChange={(event) => setNested("seo", "description", event.target.value)}
        />
      </Field>
    </div>
  );

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
      style={{ animation: "eck-fade-up 360ms var(--ease-out-soft) both" }}
    >
      <div className="space-y-5">
        {tab === "services" && (
          <>
            {textField("Title", "title")}
            {textField("Slug", "slug", { placeholder: "e-g-service-name" })}
            {textField("Category", "category")}
            {textField("Image URL / Path", "image")}
            {textAreaField("Summary", "summary")}
            {textAreaField("Full description", "description")}
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {boolField("Published", "published")}
              {boolField("Archived", "archived")}
            </div>
            {renderSeo()}
          </>
        )}

        {tab === "events" && (
          <>
            {textField("Title", "title")}
            {textField("Slug", "slug")}
            <div className="grid gap-4 sm:grid-cols-2">
              {textField("Category", "category")}
              {selectField("Status", "status", selectOptions.status)}
            </div>
            {textField("Image URL", "image")}
            {textAreaField("Summary", "summary")}
            {textAreaField("Full description", "description")}
            <div className="grid gap-4 sm:grid-cols-2">
              {textField("Start date", "startDate", { type: "datetime-local" })}
              {textField("End date", "endDate", { type: "datetime-local" })}
            </div>
            {textField("Venue", "venue")}
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {boolField("Venue verified", "venueVerified")}
              {boolField("Registration enabled", "registrationEnabled")}
              {boolField("Published", "published")}
              {boolField("Archived", "archived")}
            </div>
            {renderSeo()}
          </>
        )}

        {tab === "articles" && (
          <>
            {textField("Title", "title")}
            {textField("Slug", "slug")}
            {textField("Category", "category")}
            {textField("Featured image", "featuredImage")}
            <Field id="tags" label="Tags (comma separated)">
              <Input
                id="tags"
                value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""}
                onChange={(event) =>
                  setField("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))
                }
                placeholder="policy, capital markets, dialogue"
              />
            </Field>
            {textAreaField("Excerpt", "excerpt")}
            {textAreaField("Body content", "body")}
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {boolField("Published", "published")}
              {boolField("Archived", "archived")}
            </div>
            {renderSeo()}
          </>
        )}

        {tab === "gallery" && (
          <>
            {textField("Title", "title")}
            {textField("Slug", "slug")}
            {textField("Category", "category")}
            {textAreaField("Description", "description")}
            {renderImages()}
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {boolField("Published", "published")}
              {boolField("Archived", "archived")}
            </div>
            {renderSeo()}
          </>
        )}

        {tab === "settings" && (
          <div className="space-y-8">
            <section className="space-y-4">
              <h4 className="border-b border-brand-purple/10 pb-2 text-sm font-bold text-brand-purple">
                Contact information
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="contact-email" label="Email address">
                  <Input
                    id="contact-email"
                    type="email"
                    value={textValue(formData.contact?.email)}
                    onChange={(event) => setNested("contact", "email", event.target.value)}
                  />
                </Field>
                <Field id="contact-phone" label="Phone number">
                  <Input
                    id="contact-phone"
                    value={textValue(formData.contact?.phone)}
                    onChange={(event) => setNested("contact", "phone", event.target.value)}
                  />
                </Field>
              </div>
              <Field id="contact-address" label="Physical address">
                <Textarea
                  id="contact-address"
                  rows={2}
                  value={textValue(formData.contact?.address)}
                  onChange={(event) => setNested("contact", "address", event.target.value)}
                />
              </Field>
            </section>

            <section className="space-y-4">
              <h4 className="border-b border-brand-purple/10 pb-2 text-sm font-bold text-brand-purple">
                Social presence
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="social-linkedin" label="LinkedIn URL">
                  <Input
                    id="social-linkedin"
                    value={textValue(formData.socialLinks?.linkedin)}
                    onChange={(event) => setNested("socialLinks", "linkedin", event.target.value)}
                  />
                </Field>
                <Field id="social-instagram" label="Instagram URL">
                  <Input
                    id="social-instagram"
                    value={textValue(formData.socialLinks?.instagram)}
                    onChange={(event) => setNested("socialLinks", "instagram", event.target.value)}
                  />
                </Field>
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="border-b border-brand-purple/10 pb-2 text-sm font-bold text-brand-purple">
                Branding
              </h4>
              {textField("Site logo URL", "logo")}
            </section>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-brand-purple/10 pt-6">
        <Button className="flex-1" disabled={isPending} type="submit" variant="dark">
          {isPending ? "Saving changes..." : "Save changes"}
        </Button>
        {onCancel && (
          <Button disabled={isPending} onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textValue(value: unknown): string | number {
  return typeof value === "string" || typeof value === "number" ? value : "";
}

function toGalleryImages(value: unknown): GalleryImage[] {
  if (!Array.isArray(value)) return [];
  const images: GalleryImage[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) continue;
    images.push({
      src: typeof entry.src === "string" ? entry.src : "",
      alt: typeof entry.alt === "string" ? entry.alt : "",
      caption: typeof entry.caption === "string" ? entry.caption : undefined,
    });
  }
  return images;
}

function serializeGalleryImages(images: GalleryImage[]): GalleryImage[] {
  return images.map(({ src, alt, caption }) => (caption?.trim() ? { src, alt, caption } : { src, alt }));
}
