<template>
    <div class="py-3 px-3 h-full max-h-full flex flex-col items-start justify-center">
        <AppTitle title="Perfil" />
        <Card class="w-full h-full">
            <template #content>
                <div class="w-full h-full flex flex-col md:flex-row gap-4">
                    <section name="profile-right" class="w-full md:w-[30%] h-full flex justify-start items-start flex-col">
                        <ProfileAvatar />
                        <AccountInformation />
                    </section>
                    <Divider layout="vertical" class="h-full hidden md:flex" />
                    <Divider layout="horizontal" class="w-full flex md:hidden" />
                    <section name="profile-left" class="w-full md:w-[70%] h-full justify-start items-start flex-col gap-8 flex">
                        <PersonalInformation />
                        <DocumentInformation />
                        <AddressInformation />
                    </section>
                </div>
            </template>
        </Card>
    </div>
</template>
<script setup lang="ts">
import AppTitle from '@/core/components/AppTitle.vue';
import { Card, Divider } from 'primevue';
import ProfileAvatar from '../components/ProfileAvatar.vue';
import { onMounted, provide } from 'vue';
import { useAuth } from '../composables/useAuth';
import AccountInformation from '../components/AccountInformation.vue';
import PersonalInformation from '../components/PersonalInformation.vue';
import DocumentInformation from '../components/DocumentInformation.vue';
import AddressInformation from '../components/AddressInformation.vue';

const useAuthInstance = useAuth();
provide('useAuthInstance', useAuthInstance);
const { getNationalities, getMaritalStatuses, getGenders, getDocumentTypes, startLoading, finishLoading } = useAuthInstance;
onMounted(async () => {
    startLoading();
    await Promise.all([getNationalities(), getMaritalStatuses(), getGenders(), getDocumentTypes()]);
    finishLoading();
});


</script>
