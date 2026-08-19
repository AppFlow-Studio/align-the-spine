import { CompositeContentRepository } from "./composite-repository";
import { FixtureContentRepository } from "./fixture-repository";
import type { ContentRepository } from "./repository";
import { StaticServiceAreaRepository } from "./static-service-area-repository";

let fixtureRepository: ContentRepository | undefined;
let serviceAreaRepository: ContentRepository | undefined;

function getServiceAreaRepository(): ContentRepository {
  serviceAreaRepository ??= new StaticServiceAreaRepository();
  return serviceAreaRepository;
}

/** `blog_post` only — `service_area` is handled separately by
 * StaticServiceAreaRepository regardless of CONTENT_REPOSITORY_MODE (see
 * content/service-areas.ts for why). */
async function getBlogRepository(): Promise<ContentRepository> {
  const mode = process.env.CONTENT_REPOSITORY_MODE ?? "fixture";
  if (mode === "fixture") {
    fixtureRepository ??= new FixtureContentRepository();
    return fixtureRepository;
  }
  if (mode === "supabase") {
    const { SupabaseContentRepository } = await import("./supabase-repository");
    return SupabaseContentRepository.createFromEnvironment();
  }
  throw new Error(`Unsupported CONTENT_REPOSITORY_MODE: ${mode}`);
}

async function getEditorialBlogRepository(): Promise<ContentRepository> {
  const mode = process.env.CONTENT_REPOSITORY_MODE ?? "fixture";
  if (mode === "fixture") return getBlogRepository();
  if (mode === "supabase") {
    const [{ SupabaseContentRepository }, { createSupabaseServerClient }] = await Promise.all([
      import("./supabase-repository"),
      import("@/lib/supabase/server"),
    ]);
    return SupabaseContentRepository.createAuthenticated(await createSupabaseServerClient());
  }
  throw new Error(`Unsupported CONTENT_REPOSITORY_MODE: ${mode}`);
}

export async function getContentRepository(): Promise<ContentRepository> {
  return new CompositeContentRepository(await getBlogRepository(), getServiceAreaRepository());
}

export async function getEditorialContentRepository(): Promise<ContentRepository> {
  return new CompositeContentRepository(
    await getEditorialBlogRepository(),
    getServiceAreaRepository(),
  );
}
