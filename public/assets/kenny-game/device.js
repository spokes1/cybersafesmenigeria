// Device identity, not viewport width: a resized desktop stays a desktop.
// iPadOS can advertise a Mac user agent, so include its touch-capable identity.
export function isMobileDevice(device = navigator) {
  return device.userAgentData?.mobile === true ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(device.userAgent || '') ||
    (device.platform === 'MacIntel' && device.maxTouchPoints > 1);
}
