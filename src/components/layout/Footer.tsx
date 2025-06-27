import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 로고 및 설명 */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <div className="text-2xl font-black tracking-tight">
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]">
                  Show
                </span>
                <span className="text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)] ml-1">
                  Stats
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              MLB The Show 야구 게임의 가장 정확하고 상세한 전적 분석을
              제공합니다. 프로 플레이어들의 전략을 분석하고, 당신의 게임 실력
              향상에 도움을 드립니다.
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">빠른 링크</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  전적 조회
                </Link>
              </li>
              <li>
                <Link
                  href="/rankings"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  랭킹
                </Link>
              </li>
              <li>
                <Link
                  href="/stats"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  통계
                </Link>
              </li>
            </ul>
          </div>

          {/* 지원 */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">지원</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  도움말
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  문의하기
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  이용약관
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ShowStats. All rights reserved.</p>
          <p className="mt-1">MLB The Show Statistics & Analysis Platform</p>
        </div>
      </div>
    </footer>
  );
}
