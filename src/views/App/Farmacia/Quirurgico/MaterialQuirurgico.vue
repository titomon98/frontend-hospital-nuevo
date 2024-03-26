<template>
  <b-container fluid>
    <b-alert
      :variant="alertVariant"
      :show="alertCountDown"
      dismissible
      fade
      @dismissed="alertCountDown=0"
      class="bg-white"
    >
      <div class="iq-alert-text">{{ alertText }}</div>
    </b-alert>
    <b-modal id="modal-1-quirurgico" size="xl" ref="modal-1-quirurgico" title="Agregar material quirurgico">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form @submit="$event.preventDefault()">
        <b-row class="ml-2">
          <b-col md="6">
            <b-form-group label="Nombre:">
              <b-form-input
                v-model.trim="$v.form.name.$model"
                :state="!$v.form.name.$error"
                placeholder="Ingresar nombre del material quirurgico"
              ></b-form-input>
              <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
                Debe ingresar el nombre
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Inventariado:">
              <b-form-radio v-model="form.inventariado" value="INVENTARIADO" name="customRadio1">Inventariado</b-form-radio>
              <b-form-radio v-model="form.inventariado" value="NO INVENTARIADO" name="customRadio1">No inventariado</b-form-radio>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Facturado:">
              <b-form-radio v-model="form.factura" value="0" name="customRadio2">No factura</b-form-radio>
              <b-form-radio v-model="form.factura" value="1" name="customRadio2">Factura</b-form-radio>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="3">
            <b-form-group label="Costo:">
              <b-form-input
                v-model.trim="$v.form.precio_costo.$model"
                :state="!$v.form.precio_costo.$error"
                placeholder="Ingresar costo del medicamento"
              ></b-form-input>
              <div v-if="$v.form.precio_costo.required.$invalid" class="invalid-feedback">
                Debe ingresar el costo
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Precio de venta:">
              <b-form-input
                v-model.trim="$v.form.precio_venta.$model"
                :state="!$v.form.precio_venta.$error"
                placeholder="Ingresar precio de venta del medicamento"
              ></b-form-input>
              <div v-if="$v.form.precio_venta.required.$invalid" class="invalid-feedback">
                Debe ingresar el precio de venta
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia mínima general:">
              <b-form-input
                v-model.trim="$v.form.existencia_minima.$model"
                :state="!$v.form.existencia_minima.$error"
                placeholder="Ingresar existencia minima del medicamento"
              ></b-form-input>
              <div v-if="$v.form.existencia_minima.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia minima
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia actual general:">
              <b-form-input
                v-model.trim="$v.form.existencia_actual.$model"
                :state="!$v.form.existencia_actual.$error"
                placeholder="Ingresar existencia actual del medicamento"
              ></b-form-input>
              <div v-if="$v.form.existencia_actual.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia actual
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia mínima quirófano:">
              <b-form-input
                v-model.trim="$v.form.existencia_minima_quirofano.$model"
                :state="!$v.form.existencia_minima_quirofano.$error"
                placeholder="Ingresar existencia minima del medicamento en quirófano"
              ></b-form-input>
              <div v-if="$v.form.existencia_minima_quirofano.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia minima de quirófano
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia actual quirófano:">
              <b-form-input
                v-model.trim="$v.form.existencia_actual_quirofano.$model"
                :state="!$v.form.existencia_actual_quirofano.$error"
                placeholder="Ingresar existencia actual del medicamento en quirófano"
              ></b-form-input>
              <div v-if="$v.form.existencia_actual_quirofano.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia actual de quirófano
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia mínima enfermería:">
              <b-form-input
                v-model.trim="$v.form.existencia_minima_farmacia.$model"
                :state="!$v.form.existencia_minima_farmacia.$error"
                placeholder="Ingresar existencia minima del medicamento en farmacia"
              ></b-form-input>
              <div v-if="$v.form.existencia_minima_farmacia.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia minima de farmacia
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia actual enfermería:">
              <b-form-input
                v-model.trim="$v.form.existencia_actual_farmacia.$model"
                :state="!$v.form.existencia_actual_farmacia.$error"
                placeholder="Ingresar existencia actual del medicamento en farmacia"
              ></b-form-input>
              <div v-if="$v.form.existencia_actual_farmacia.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia actual de farmacia
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="4">
            <b-form-group label="Marca:">
              <v-select
                name="marca"
                v-model="$v.form.marca.$model"
                :state="!$v.form.marca.$error"
                :options="marcas"
                :filterable="false"
                placeholder="Seleccione la marca"
                @search="onSearchMarca"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.marca.$error" class="invalid-feedback-vselect">
                Debe seleccionar la marca
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Presentación:">
              <v-select
                name="presentacion"
                v-model="$v.form.presentacion.$model"
                :state="!$v.form.presentacion.$error"
                :options="presentaciones"
                :filterable="false"
                placeholder="Seleccione la presentacion"
                @search="onSearchPresentacion"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.presentacion.$error" class="invalid-feedback-vselect">
                Debe seleccionar la presentacion
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Proveedor:">
              <v-select
                name="proveedor"
                v-model="$v.form.proveedor.$model"
                :state="!$v.form.proveedor.$error"
                :options="proveedores"
                :filterable="false"
                placeholder="Seleccione el proveedor"
                @search="onSearchProveedor"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.proveedor.$error" class="invalid-feedback-vselect">
                Debe seleccionar el proveedor
              </div>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('save')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('save')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-2-quirurgico" size="xl" ref="modal-2-quirurgico" title="Editar material quirurgico">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form @submit="$event.preventDefault()">
        <b-row class="ml-2">
          <b-col md="6">
            <b-form-group label="Nombre:">
              <b-form-input
                v-model.trim="$v.form.name.$model"
                :state="!$v.form.name.$error"
                placeholder="Ingresar nombre del material quirurgico"
              ></b-form-input>
              <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
                Debe ingresar el nombre
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Inventariado:">
              <b-form-radio v-model="form.inventariado" value="INVENTARIADO" name="customRadio1">Inventariado</b-form-radio>
              <b-form-radio v-model="form.inventariado" value="NO INVENTARIADO" name="customRadio1">No inventariado</b-form-radio>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Facturado:">
              <b-form-radio v-model="form.factura" value="0" name="customRadio2">No factura</b-form-radio>
              <b-form-radio v-model="form.factura" value="1" name="customRadio2">Factura</b-form-radio>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="3">
            <b-form-group label="Costo:">
              <b-form-input
                v-model.trim="$v.form.precio_costo.$model"
                :state="!$v.form.precio_costo.$error"
                placeholder="Ingresar costo del medicamento"
              ></b-form-input>
              <div v-if="$v.form.precio_costo.required.$invalid" class="invalid-feedback">
                Debe ingresar el costo
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Precio de venta:">
              <b-form-input
                v-model.trim="$v.form.precio_venta.$model"
                :state="!$v.form.precio_venta.$error"
                placeholder="Ingresar precio de venta del medicamento"
              ></b-form-input>
              <div v-if="$v.form.precio_venta.required.$invalid" class="invalid-feedback">
                Debe ingresar el precio de venta
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia mínima general:">
              <b-form-input
                v-model.trim="$v.form.existencia_minima.$model"
                :state="!$v.form.existencia_minima.$error"
                placeholder="Ingresar existencia minima del medicamento"
              ></b-form-input>
              <div v-if="$v.form.existencia_minima.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia minima
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia actual general:">
              <b-form-input
                v-model.trim="$v.form.existencia_actual.$model"
                :state="!$v.form.existencia_actual.$error"
                placeholder="Ingresar existencia actual del medicamento"
              ></b-form-input>
              <div v-if="$v.form.existencia_actual.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia actual
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia mínima quirófano:">
              <b-form-input
                v-model.trim="$v.form.existencia_minima_quirofano.$model"
                :state="!$v.form.existencia_minima_quirofano.$error"
                placeholder="Ingresar existencia minima del medicamento en quirófano"
              ></b-form-input>
              <div v-if="$v.form.existencia_minima_quirofano.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia minima de quirófano
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia actual quirófano:">
              <b-form-input
                v-model.trim="$v.form.existencia_actual_quirofano.$model"
                :state="!$v.form.existencia_actual_quirofano.$error"
                placeholder="Ingresar existencia actual del medicamento en quirófano"
              ></b-form-input>
              <div v-if="$v.form.existencia_actual_quirofano.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia actual de quirófano
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia mínima enfermería:">
              <b-form-input
                v-model.trim="$v.form.existencia_minima_farmacia.$model"
                :state="!$v.form.existencia_minima_farmacia.$error"
                placeholder="Ingresar existencia minima del medicamento en farmacia"
              ></b-form-input>
              <div v-if="$v.form.existencia_minima_farmacia.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia minima de farmacia
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group v-if="form.inventariado === 'INVENTARIADO'" label="Existencia actual enfermería:">
              <b-form-input
                v-model.trim="$v.form.existencia_actual_farmacia.$model"
                :state="!$v.form.existencia_actual_farmacia.$error"
                placeholder="Ingresar existencia actual del medicamento en farmacia"
              ></b-form-input>
              <div v-if="$v.form.existencia_actual_farmacia.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia actual de farmacia
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="4">
            <b-form-group label="Marca:">
              <v-select
                name="marca"
                v-model="$v.form.marca.$model"
                :state="!$v.form.marca.$error"
                :options="marcas"
                :filterable="false"
                placeholder="Seleccione la marca"
                @search="onSearchMarca"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.marca.$error" class="invalid-feedback-vselect">
                Debe seleccionar la marca
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Presentación:">
              <v-select
                name="presentacion"
                v-model="$v.form.presentacion.$model"
                :state="!$v.form.presentacion.$error"
                :options="presentaciones"
                :filterable="false"
                placeholder="Seleccione la presentacion"
                @search="onSearchPresentacion"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.presentacion.$error" class="invalid-feedback-vselect">
                Debe seleccionar la presentacion
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Proveedor:">
              <v-select
                name="proveedor"
                v-model="$v.form.proveedor.$model"
                :state="!$v.form.proveedor.$error"
                :options="proveedores"
                :filterable="false"
                placeholder="Seleccione el proveedor"
                @search="onSearchProveedor"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.proveedor.$error" class="invalid-feedback-vselect">
                Debe seleccionar el proveedor
              </div>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('update')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('update')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-quirurgico" ref="modal-3-quirurgico" title="Desactivar material quirurgico">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <h6 class="my-4">
        ¿Desea desactivar el material quirurgico: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-quirurgico')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-quirurgico')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-quirurgico" ref="modal-4-quirurgico" title="Activar material quirurgico">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <h6 class="my-4">
        ¿Desea activar al material quirurgico: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-quirurgico')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-quirurgico')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Material quirúrgico</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
            <b-button variant="primary"  v-b-modal.modal-1-quirurgico>AGREGAR NUEVO</b-button>
          </template>
          <template v-slot:body>
            <datatable-heading
              :changePageSize="changePageSizes"
              :searchChange="searchChange"
              :from="from"
              :to="to"
              :total="total"
              :perPage="perPage"
            >
            </datatable-heading>
            <vuetable
              ref="vuetable"
              class="table-divided order-with-arrow"
              :api-url="apiBase"
              :query-params="makeQueryParams"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fields"
              pagination-path
              @vuetable:pagination-data="onPaginationData"
            >
              <!-- Estado -->
              <div slot="estado" slot-scope="props">
                <h5 v-if="props.rowData.estado == 1">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>ACTIVO</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else>
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>INACTIVO</strong></h6></b-badge
                  >
                </h5>
              </div>
              <div slot="factura" slot-scope="props">
                <h5 v-if="props.rowData.factura == 1">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>SI FACTURA</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else>
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>NO FACTURA</strong></h6></b-badge
                  >
                </h5>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="'Editar'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-2-quirurgico
                    class="mb-2"
                    size="sm"
                    variant="outline-warning"
                    ><i :class="'fas fa-pencil-alt'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="
                      props.rowData.estado == 1 ? 'Desactivar' : 'Activar'"
                    @click="
                      setData(props.rowData);
                      props.rowData.estado == 1
                        ? $bvModal.show('modal-3-quirurgico')
                        : $bvModal.show('modal-4-quirurgico');
                    "
                    class="mb-2"
                    size="sm"
                    :variant="
                      props.rowData.estado == 1 ? 'outline-danger' : 'outline-info'">
                    <i
                      :class="
                        props.rowData.estado == 1
                          ? 'fas fa-trash-alt'
                          : 'fas fa-check'"
                  /></b-button>
                </b-button-group>
              </template>
              <!-- Paginacion -->
            </vuetable>
            <vuetable-pagination-bootstrap
                ref="pagination"
                @vuetable-pagination:change-page="onChangePage"
              />
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../../config/pluginInit'
import DatatableHeading from '../../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/common/VuetablePaginationBootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'

export default {
  name: 'Bank',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  setup () {
    return { $v: useVuelidate() }
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      marcas: [],
      presentaciones: [],
      proveedores: [],
      form: {
        id: 0,
        name: '',
        precio_costo: 0,
        precio_venta: 0,
        existencia_minima: 0,
        existencia_actual: 0,
        existencia_minima_quirofano: 0,
        existencia_actual_quirofano: 0,
        existencia_minima_farmacia: 0,
        existencia_actual_farmacia: 0,
        inventariado: 'INVENTARIADO',
        factura: 1,
        marca: null,
        proveedor: null,
        presentacion: null,
        state: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/quirurgico/list',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'nombre',
          sortField: 'name',
          title: 'Nombre',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_costo',
          sortField: 'precio_costo',
          title: 'Precio costo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_venta',
          sortField: 'precio_venta',
          title: 'Precio venta',
          dataClass: 'list-item-heading'
        },
        {
          name: 'existencia_minima',
          sortField: 'existencia_minima',
          title: 'Existencia minima',
          dataClass: 'list-item-heading'
        },
        {
          name: 'existencia_actual',
          sortField: 'existencia_actual',
          title: 'Existencia actual',
          dataClass: 'list-item-heading'
        },
        {
          name: 'inventariado',
          sortField: 'inventariado',
          title: 'Inventariado',
          dataClass: 'list-item-heading'
        },
        {
          name: '__slot:factura',
          title: 'Factura',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: '__slot:estado',
          title: 'Estado',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        }
      ]
    }
  },
  validations () {
    return {
      form: {
        name: { required },
        precio_costo: { required },
        precio_venta: { required },
        existencia_minima: { required },
        existencia_actual: { required },
        existencia_minima_quirofano: { required },
        existencia_actual_quirofano: { required },
        existencia_minima_farmacia: { required },
        existencia_actual_farmacia: { required },
        marca: { required },
        presentacion: { required },
        proveedor: { required }
      }
    }
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.name = ''
          this.form.precio_costo = 0
          this.form.precio_venta = 0
          this.form.existencia_minima = 0
          this.form.existencia_actual = 0
          this.form.existencia_minima_quirofano = 0
          this.form.existencia_actual_quirofano = 0
          this.form.existencia_minima_farmacia = 0
          this.form.existencia_actual_farmacia = 0
          this.form.inventariado = 'INVENTARIADO'
          this.form.factura = 1
          this.form.marca = null
          this.form.presentacion = null
          this.form.proveedor = null
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-quirurgico'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.precio_costo = 0
          this.form.precio_venta = 0
          this.form.existencia_minima = 0
          this.form.existencia_actual = 0
          this.form.existencia_minima_quirofano = 0
          this.form.existencia_actual_quirofano = 0
          this.form.existencia_minima_farmacia = 0
          this.form.existencia_actual_farmacia = 0
          this.form.inventariado = 'INVENTARIADO'
          this.form.factura = 1
          this.form.marca = null
          this.form.presentacion = null
          this.form.proveedor = null
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-quirurgico'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.precio_costo = 0
          this.form.precio_venta = 0
          this.form.existencia_minima = 0
          this.form.existencia_actual = 0
          this.form.existencia_minima_quirofano = 0
          this.form.existencia_actual_quirofano = 0
          this.form.existencia_minima_farmacia = 0
          this.form.existencia_actual_farmacia = 0
          this.form.inventariado = 'INVENTARIADO'
          this.form.factura = 1
          this.form.marca = null
          this.form.presentacion = null
          this.form.proveedor = null
          this.form.state = 1
          break
        }
      }
    },
    onValidate (action) {
      this.$v.$touch()
      if (this.$v.$error !== true) {
        if (action === 'save') {
          this.onSave()
        } else if (action === 'update') {
          this.onUpdate()
        }
      } else {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      }
    },
    setData (data) {
      this.form.name = data.nombre
      this.form.state = data.estado
      this.form.precio_costo = data.precio_costo
      this.form.precio_venta = data.precio_venta
      this.form.existencia_minima = data.existencia_minima
      this.form.existencia_actual = data.existencia_actual
      this.form.existencia_minima_quirofano = data.existencia_minima_quirofano
      this.form.existencia_actual_quirofano = data.existencia_actual_quirofano
      this.form.existencia_minima_farmacia = data.existencia_minima_farmacia
      this.form.existencia_actual_farmacia = data.existencia_actual_farmacia
      this.form.inventariado = data.inventariado
      this.form.factura = data.factura
      this.form.factura = data.factura
      this.form.marca = data.marca
      this.form.presentacion = data.presentacione
      this.form.proveedor = data.proveedore
      this.form.id = data.id
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/quirurgico/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el material quirurgico ' + me.form.name + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('save')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    /* Guardar */
    onUpdate () {
      const me = this
      // this.$refs["modalSave"].hide();
      axios.put(apiUrl + '/quirurgico/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el material quirurgico ' + me.form.name + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('update')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('Error!', error)
        })
    },
    onState () {
      let me = this
      if (this.form.state === 1) {
        axios
          .put(apiUrl + '/quirurgico/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el material quirurgico ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-quirurgico'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/quirurgico/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el material quirurgico ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-quirurgico'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
    },
    makeQueryParams (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search
        }
    },
    changePageSizes (perPage) {
      this.perPage = perPage
      this.$refs.vuetable.refresh()
    },
    searchChange (val) {
      this.search = val.toLowerCase()
      this.$refs.vuetable.refresh()
    },
    onPaginationData (paginationData) {
      this.from = paginationData.from
      this.to = paginationData.to
      this.total = paginationData.total
      this.lastPage = paginationData.last_page
      this.items = paginationData.data
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    showAlertError () {
      this.alertCountDownError = this.alertSecs
    },
    onSearchMarca (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingMarcas(search, loading)
      }
    },
    searchingMarcas (search, loading) {
      axios.get(apiUrl + '/marca/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.marcas = response.data
        loading(false)
      })
    },
    onSearchPresentacion (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingPresentaciones(search, loading)
      }
    },
    searchingPresentaciones (search, loading) {
      axios.get(apiUrl + '/presentacion/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.presentaciones = response.data
        loading(false)
      })
    },
    onSearchProveedor (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingProveedor(search, loading)
      }
    },
    searchingProveedor (search, loading) {
      axios.get(apiUrl + '/proveedor/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        console.log(response.data)
        this.proveedores = response.data
        loading(false)
      })
    }
  }
}
</script>
