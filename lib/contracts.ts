import { ethers } from "ethers";
import EduTokenAbi from "@/abis/EduToken.json";
import StipendManagerAbi from "@/abis/StipendManager.json";

export const EDU_TOKEN_ADDRESS = "0xe74A6Bd14E34a59F7b1308654F31E6AF2d641204"; 
export const STIPEND_MANAGER_ADDRESS = "YOUR_STIPEND_MANAGER_ADDRESS";

export function getSigner() {
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  return provider.getSigner();
}

export function getEduTokenContract() {
  return new ethers.Contract(EDU_TOKEN_ADDRESS, EduTokenAbi, getSigner());
}

export function getStipendContract() {
  return new ethers.Contract(STIPEND_MANAGER_ADDRESS, StipendManagerAbi, getSigner());
}
