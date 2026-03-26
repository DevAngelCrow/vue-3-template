<template>
    <div class="py-5 px-5 h-full max-h-full flex gap-3 flex-col">
        <AppTitle :title="actionMode.title" />
        <section id="form">
            <div class="w-full flex flex-wrap gap-5">
                <AppInputText class="flex-1 min-w-0" id="name" label="Nombre*" v-model="name"
                    :error-messages="errors.name" v-bind="nameAttrs" :readonly="actionMode.isReadonly"
                    maxlength="150" />
                <AppInputText class="flex-1 min-w-0" id="code" label="Código*" v-model="code"
                    :error-messages="errors.code" v-bind="codeAttrs" :readonly="actionMode.isReadonly"
                    maxlength="150" />
                <AppInputText class="flex-1 min-w-0" id="description" label="Descripción" v-model="description"
                    :error-messages="errors.description" v-bind="descriptionAttrs" :readonly="actionMode.isReadonly"
                    maxlength="150" />
                <AppAutocomplete class="flex-1 min-w-0" id="status" label="Estado*" v-model="status" v-bind="statusAttrs"
                    :error-messages="errors.status" option-label="name" :suggestions="statusFiltered" dropdown
                    @complete="findAutocomplete" :readonly="actionMode.isReadonly" :disabled="actionMode.mode === 'add' || actionMode.mode === 'edit'
                        " />
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRole } from '../composables/useRole';
import { AutoCompleteCompleteEvent } from 'primevue';
import { useRoute } from 'vue-router';
const route = useRoute();
const actionMode = reactive<{
    mode: 'add' | 'view' | 'edit';
    title: string;
    description: string;
    isReadonly: boolean;
    selectedItem: null | number;
}>({
    mode: 'add',
    title: 'Crear nuevo rol',
    description: '',
    isReadonly: false,
    selectedItem: null as number | null,
});


const {
    errors,
    name,
    nameAttrs,
    description,
    descriptionAttrs,
    code,
    codeAttrs,
    status,
    statusAttrs,
    globalStatus,
    getPermissions,
    getRolById,
    setRoleItem,
} = useRole();

const statusFiltered = ref<unknown[]>([]);
const findAutocomplete = (event: AutoCompleteCompleteEvent) => {
    let query = event?.query;
    let _filteredItems = [];
    for (let i = 0; i < globalStatus.value.length; i++) {
        let item = globalStatus.value[i];

        if (item?.name?.toLowerCase().indexOf(query.toLowerCase()) === 0) {
            _filteredItems.push(item);
        }
    }
    statusFiltered.value = _filteredItems;
};

onMounted(async () => {
    try {
    if(route.params.id) {
        actionMode.mode = 'view';
        actionMode.title = 'Detalle del rol';
        actionMode.isReadonly = true;
    }
    const rol = await getRolById(+route.params.id)
    
    
    if(!rol || !rol.data) {
        console.error('No se pudo obtener el rol');
        return;
    }
    const data = {
        id: rol.data.id,
        name: rol.data.name,
        description: rol.data.description,
        code: rol.data.code,
        status: rol.data.status,
        id_status: rol.data.status.id,
        permissions: rol.data.permissions,
    }
    setRoleItem(data);
  } catch (error) {
    console.error(error);
  }
});
</script>
<style lang="scss" scoped></style>