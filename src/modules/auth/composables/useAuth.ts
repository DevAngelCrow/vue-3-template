import { ref } from 'vue';

export function useAuth() {
  //personal info
  const firstName = ref<string>('');
  const middleName = ref<string>('');
  const lastName = ref<string>('');
  const birthDate = ref<string>('');
  const gender = ref<number>();
  const maritalStatus = ref<number>();
  const imgFile = ref<File | null>();
  const phoneNumber = ref<string>();
  const status = ref<number>();
  const nationalities = ref<number[]>();

  //address info

  const street = ref<string>();
  const streetNumber = ref<string>();
  const neighborhood = ref<string>();
  const district = ref<number>();
  const houseNumber = ref<string>();
  const block = ref<string>();
  const pathway = ref<string>();
  const current = ref<boolean>(false);

  //personal document info

  const documentType = ref<number>();
  const documentNumber = ref<string>();

  //user info

  const email = ref<string>('');
  const password = ref<string>();

  const login = (user: string, password: string) => {
    console.log(user, 'Usuario');
    console.log(password, 'Password');
  };

  return {
    login,
    firstName,
    middleName,
    lastName,
    birthDate,
    gender,
    email,
    maritalStatus,
    imgFile,
    phoneNumber,
    status,
    nationalities,
    street,
    streetNumber,
    neighborhood,
    district,
    houseNumber,
    block,
    pathway,
    current,
    documentType,
    documentNumber,
    password,
  };
}
