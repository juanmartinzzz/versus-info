import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { internationalization } from "../../internationalization/internationalization";

const ShareWithQRCode = () => {
  const translated = internationalization.getTranslated();
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl text-accent3 font-bold mb-2">{translated.useThisQrCodeToChallengeSomeoneInFrontOfYou}</h2>

        <div className="mt-4 flex justify-center">
          <QRCodeSVG
            value={window.location.href}
            size={150}
            bgColor="#ffffff"
            // fgColor="var(--color-primary)"
            className="rounded-md shadow-lg"
          />
        </div>
      </motion.div>
    </>
  )
}

export default ShareWithQRCode;