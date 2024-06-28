import { registerInDevtools, Store } from "pullstate";

export const WizardStore = new Store({
  activity: "",
  activityId: "",
  travelType: "",
  location: "",
  keperluan: "",
  note: "",
  NIK: "",
  fullName: "",
  unitKerja: "",
  accesssRights: "",
  nama_unitKerja: "",
  nama_jabatan: "",
  startDate: "",
  endDate: "",
  startDateData: "",
  endDateData: "",
  daysCount: "",
  applicant: "",
  approver: "",
  token: "",
  progress: 0,
});

registerInDevtools({
  WizardStore,
});
