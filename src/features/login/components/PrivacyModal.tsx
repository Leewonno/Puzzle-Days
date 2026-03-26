import { Modal } from "../../../components/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: Props) {
  return (
    <Modal open={open}>
      <div className="w-full flex flex-col gap-4 max-h-[70vh]">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">
            개인정보 처리방침
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex flex-col gap-5 text-sm text-gray-600 leading-relaxed pr-1">
          {/* 서문 */}
          <p className="text-xs text-gray-500">
            Puzzle Days(이하 "서비스")는 「개인정보 보호법」 및 관계 법령을
            준수하여 이용자의 개인정보를 적법하게 처리하고 안전하게 관리합니다.
            이에 동법 제30조에 따라 다음과 같이 개인정보 처리방침을
            수립·공개합니다.
          </p>

          {/* 1. 처리 목적 및 항목 */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-2">
              1. 개인정보의 처리 목적 및 항목
            </h3>
            <p className="mb-2">
              서비스는 Google 로그인 시 다음 정보를 수집하며, 수집 목적 외의
              용도로 이용하지 않습니다.
            </p>
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1.5 text-xs">
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 shrink-0">수집 항목</span>
                <span>닉네임, 이메일 주소, 프로필 사진</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 shrink-0">처리 목적</span>
                <span>
                  회원 식별 및 서비스 제공, 제작한 퍼즐 저장·관리, 고객 문의
                  대응
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 shrink-0">법적 근거</span>
                <span>
                  「개인정보 보호법」 제15조제1항제4호 (계약 체결·이행)
                </span>
              </div>
            </div>
          </section>

          {/* 2. 보유 기간 */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              2. 개인정보의 처리 및 보유 기간
            </h3>
            <p>
              수집된 개인정보는 회원 탈퇴 시까지 보유합니다. 단, 관계 법령
              위반에 따른 수사·조사가 진행 중인 경우 해당 사유 종료 시까지
              보유할 수 있습니다.
            </p>
          </section>

          {/* 3. 파기 */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              3. 개인정보의 파기 절차 및 방법
            </h3>
            <p>
              개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이
              파기합니다. 전자적 파일 형태로 저장된 개인정보는 복구 불가능한
              방법으로 영구 삭제합니다.
            </p>
          </section>

          {/* 4. 제3자 제공 */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              4. 개인정보의 제3자 제공
            </h3>
            <p>
              서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단,
              Google OAuth 인증 과정에서 Google이 별도로 수집하는 정보는
              Google의 개인정보 처리방침을 따릅니다. 법령에 의한 요청이 있는
              경우는 예외로 합니다.
            </p>
          </section>

          {/* 5. 안전성 확보조치 */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              5. 개인정보의 안전성 확보조치
            </h3>
            <ul className="list-disc list-inside flex flex-col gap-0.5 text-gray-500">
              <li>기술적 조치: 개인정보 접근 권한 관리, 접속 기록 보관</li>
              <li>관리적 조치: 개인정보 처리 담당자 최소화</li>
            </ul>
          </section>

          {/* 6. 정보주체의 권리 */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              6. 정보주체의 권리·의무 및 행사 방법
            </h3>
            <p className="mb-1.5">
              이용자는 언제든지 다음 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside flex flex-col gap-0.5 text-gray-500">
              <li>개인정보 열람, 정정·삭제, 처리 정지 요구</li>
              <li>동의 철회(회원 탈퇴를 통해 행사 가능)</li>
            </ul>
            <p className="mt-1.5 text-xs text-gray-400">
              권리 행사는 앱 내 설정 또는 아래 개인정보 보호책임자에게 이메일로
              요청하실 수 있습니다. 서비스는 요청을 받은 날부터 10일 이내에
              조치합니다.
            </p>
          </section>

          {/* 7. 개인정보 보호책임자 */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              7. 개인정보 보호책임자
            </h3>
            <div className="text-gray-500 flex flex-col gap-0.5 text-xs">
              <span>담당 부서: 서비스 운영팀</span>
              <span>
                이메일:{" "}
                <span className="text-indigo-400">jsca5253@gmail.com</span>
              </span>
            </div>
          </section>

          {/* 8. 권익침해 구제 */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              8. 권익침해 구제 방법
            </h3>
            <p className="mb-1">
              개인정보 침해로 인한 구제를 받기 위해 아래 기관에 신고하거나
              상담을 신청하실 수 있습니다.
            </p>
            <ul className="list-disc list-inside flex flex-col gap-0.5 text-gray-500 text-xs">
              <li>
                개인정보 분쟁조정위원회: (국번없이) 1833-6972 (kopico.go.kr)
              </li>
              <li>
                개인정보침해 신고센터: (국번없이) 118 (privacy.kisa.or.kr)
              </li>
              <li>경찰청: (국번없이) 182 (ecrm.police.go.kr)</li>
            </ul>
          </section>

          {/* 9. 처리방침 변경 */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              9. 개인정보 처리방침의 변경
            </h3>
            <p>
              이 처리방침은 2026년 3월 26일부터 적용됩니다. 내용 변경 시 앱 내
              공지를 통해 사전 안내합니다.
            </p>
          </section>
        </div>

        <button
          className="w-full py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </Modal>
  );
}
