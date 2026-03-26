import { Modal } from "../../../components/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TermsModal({ open, onClose }: Props) {
  return (
    <Modal open={open}>
      <div className="w-full flex flex-col gap-4 max-h-[70vh]">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">서비스 이용약관</h2>
          <button
            onClick={onClose}
            className="text-gray-400 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex flex-col gap-5 text-sm text-gray-600 leading-relaxed pr-1">
          <section>
            <h3 className="font-semibold text-gray-800 mb-1">제1조 (목적)</h3>
            <p>
              이 약관은 Puzzle Days(이하 "서비스")를 이용함에 있어 서비스와
              이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              제2조 (약관의 개정)
            </h3>
            <p>
              서비스는 필요한 경우 약관을 개정할 수 있으며, 개정 시 적용일자 7일
              이전부터 앱 내 공지를 통해 안내합니다. 이용자에게 불리한 변경의
              경우 최소 30일 전에 공지합니다. 변경된 약관에 동의하지 않는 경우
              서비스 이용을 중단하고 탈퇴할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              제3조 (서비스 제공 및 변경)
            </h3>
            <p>서비스는 다음의 기능을 제공합니다.</p>
            <ul className="list-disc list-inside mt-1 flex flex-col gap-0.5 text-gray-500">
              <li>사진 업로드 및 직소 퍼즐 제작</li>
              <li>퍼즐 플레이 및 공유</li>
              <li>기타 서비스가 정하는 기능</li>
            </ul>
            <p className="mt-2">
              서비스는 운영상 필요한 경우 제공 내용을 변경할 수 있으며, 중대한
              변경은 사전에 공지합니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              제4조 (서비스의 중단)
            </h3>
            <p>
              서비스는 시스템 점검·교체·고장, 통신 두절 등의 사유로 일시적으로
              중단될 수 있습니다. 사업 종료 시에는 30일 전 앱 내 공지를 통해
              이용자에게 통지합니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              제5조 (회원가입)
            </h3>
            <p>
              서비스는 Google 로그인을 통해 가입할 수 있습니다. 다음에 해당하는
              경우 가입이 제한될 수 있습니다.
            </p>
            <ul className="list-disc list-inside mt-1 flex flex-col gap-0.5 text-gray-500">
              <li>허위 정보를 등록한 경우</li>
              <li>이전에 이용 자격을 상실한 경우</li>
              <li>기타 기술상 지장이 있다고 판단되는 경우</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              제6조 (회원 탈퇴 및 자격 상실)
            </h3>
            <p>
              이용자는 언제든지 탈퇴를 요청할 수 있으며, 서비스는 즉시
              처리합니다. 다음에 해당하는 경우 서비스는 이용 자격을 제한하거나
              상실시킬 수 있습니다.
            </p>
            <ul className="list-disc list-inside mt-1 flex flex-col gap-0.5 text-gray-500">
              <li>타인의 정보를 도용한 경우</li>
              <li>다른 이용자의 서비스 이용을 방해한 경우</li>
              <li>불법·음란 콘텐츠를 게시한 경우</li>
              <li>법령 또는 약관을 위반한 경우</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              제7조 (이용자의 의무)
            </h3>
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc list-inside mt-1 flex flex-col gap-0.5 text-gray-500">
              <li>타인의 정보 도용</li>
              <li>서비스에 게시된 정보의 무단 변경</li>
              <li>타인의 저작권 등 지적재산권 침해</li>
              <li>외설·폭력적 콘텐츠 게시</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">제8조 (저작권)</h3>
            <p>
              서비스가 제작한 콘텐츠의 저작권은 서비스에 귀속됩니다. 이용자가
              업로드한 이미지의 저작권은 이용자에게 있으며, 이용자는 해당
              이미지에 대한 권리를 보유함을 보증합니다. 이용자는 서비스 내
              콘텐츠를 서비스의 사전 동의 없이 영리 목적으로 이용할 수 없습니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              제9조 (개인정보보호)
            </h3>
            <p>
              서비스는 이용자의 개인정보를 서비스 제공에 필요한 최소한의
              범위에서 수집하며, 수집된 개인정보는 목적 외의 용도로 이용하지
              않습니다. 자세한 내용은 개인정보처리방침을 확인하시기 바랍니다.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-1">
              제10조 (준거법 및 관할)
            </h3>
            <p>
              이 약관은 대한민국 법령에 따라 해석됩니다. 서비스 이용과 관련한
              분쟁은 관할 법원에서 해결합니다.
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
