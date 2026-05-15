import { NextResponse, type NextRequest } from "next/server";
import { decryptSession, SESSION_COOKIE_NAME } from "@/lib/session";

const PUBLIC_CRM_PATHS = new Set(["/crm/login"]);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Apenas rotas /crm são tratadas aqui.
  if (!pathname.startsWith("/crm")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(token);

  // /crm/login é pública. Se já logado, manda para /crm.
  if (PUBLIC_CRM_PATHS.has(pathname)) {
    if (session?.memberId) {
      const url = req.nextUrl.clone();
      url.pathname = "/crm";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Demais rotas /crm exigem sessão.
  if (!session?.memberId) {
    const url = req.nextUrl.clone();
    url.pathname = "/crm/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/crm/:path*"],
};
