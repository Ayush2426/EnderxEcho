import agoraToken from "agora-token"; // UPDATED IMPORT
const { RtcTokenBuilder, RtcRole } = agoraToken; // Destructure after importing

export const generateAgoraToken = (req, res) => {
  const channelName = req.query.channelName;
  const uid = req.user._id.toString();

  if (!channelName) {
    return res.status(400).json({ error: "channelName is required" });
  }

  const APP_ID = process.env.AGORA_APP_ID;
  const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600; // Token is valid for 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.json({ token });
};
