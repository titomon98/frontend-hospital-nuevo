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
    <b-modal id="modal-2-expediente" ref="modal-2-expediente" size="xl" title="Editar expediente">
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
        <div>
          <b-tabs content-class="mt-3">
            <b-tab title="Paciente" active>
              <b-row class="ml-2">
                <b-col md="2">
                  <b-form-group label="Nombre:">
                    <span class="required-asterisk" style="position: absolute; top: 50%; transform: translateY(-50%); right: 5px; color: red;"></span>
                    <b-form-input
                      v-model.trim="$v.form.nombre.$model"
                      :class="{'is-invalid': $v.form.nombre.$error}"
                      placeholder="Ingresar nombre"
                      required
                    ></b-form-input>
                    <div v-if="$v.form.nombre.$error" class="invalid-feedback">
                      <div v-if="!$v.form.nombre.required.$error">Debe ingresar nombre</div>
                      <div v-if="!$v.form.nombre.ValidateName.$error">El nombre solo debe contener letras mayúsculas y con tildes</div>
                    </div>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Apellidos:">
                    <b-form-input
                      v-model.trim="$v.form.apellidos.$model"
                      :class="{'is-invalid': $v.form.apellidos.$error}"
                      placeholder="Ingresar apellidos"
                    ></b-form-input>
                    <div v-if="$v.form.apellidos.required.$invalid" class="invalid-feedback">
                      Ingresar los apellidos
                    </div>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Apellido de casada: ">
                    <b-form-input
                      v-model.trim="form.casada"
                      placeholder="Ingresar apellido de casada"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Fecha de nacimiento:">
                    <b-form-input
                      type="date"
                      v-model.trim="$v.form.nacimiento.$model"
                      :class="{'is-invalid': $v.form.nacimiento.$error}"
                      placeholder="Ingresar fecha de nacimiento"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Telefono:">
                    <b-form-input
                      v-model.trim="$v.form.telefono.$model"
                      :class="{'is-invalid': $v.form.telefono.$error}"
                      placeholder="Ingresar telefono"
                    ></b-form-input>
                    <div v-if="$v.form.telefono.required.$invalid" class="invalid-feedback">
                      Debe ingresar el telefono
                    </div>
                    <div v-if="$v.form.telefono.numeric.$invalid" class="invalid-feedback">
                      Debe ingresar unicamente numeros
                    </div>
                  </b-form-group>
                </b-col>
                <!-- columna -->
                <b-col md="2">
                  <b-form-group label="Sexo:">
                    <v-select
                      name="type"
                      v-model="form.generos"
                      :options="generos"
                      placeholder="Seleccione el sexo"
                    />
                  </b-form-group>
                </b-col>

              </b-row>
              <b-row class="ml-2">
                <!-- columna -->
                <b-col md="2">
                  <b-form-group label="CUI:">
                    <b-form-input
                      v-model.trim="$v.form.cui.$model"
                      :class="{'is-invalid': $v.form.cui.$error}"
                      placeholder="Ingresar el CUI"
                    ></b-form-input>
                    <div v-if="$v.form.cui.$error" class="invalid-feedback">
                      El valor del CUI debe ser numerico.
                    </div>
                    <div v-if="$v.form.cui.numeric.$invalid" class="invalid-feedback">
                      Debe ingresar unicamente numeros
                    </div>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Nacionalidad:">
                    <v-select
                      name="type"
                      v-model="form.nacionalidad"
                      :options="nacionalidades"
                      placeholder="Seleccione nacionalidad"
                    />
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Dirección:">
                    <b-form-input
                      v-model.trim="$v.form.direccion.$model"
                      :class="{'is-invalid': $v.form.direccion.$error}"
                      placeholder="Ingresar dirección"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Lugar de nacimiento:">
                    <b-form-input
                      v-model.trim="form.lugar_nacimiento"
                      placeholder="Ingresar lugar de nacimiento"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Profesión u oficio:">
                    <b-form-input
                      v-model.trim="form.profesion"
                      placeholder="Ingresar profesión"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Estado civil:">
                    <v-select
                      name="type"
                      v-model="form.estado_civil"
                      :options="estados_civiles"
                      placeholder="Seleccione estado civil"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row  class="ml-2">
                <b-col md="2">
                  <b-form-group label="Nombre del padre:">
                    <b-form-input
                      v-model.trim="form.nombre_padre"
                      placeholder="Ingresar nombre del padre"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Nombre de la madre:">
                    <b-form-input
                      v-model.trim="form.nombre_madre"
                      placeholder="Ingresar nombre de la madre"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="Encargado">
              <b-row class="ml-2">
              <!-- columna -->
              <b-col md="4">
                <b-form-group label="Nombre:">
                  <b-form-input
                    v-model.trim="$v.form.nombre_encargado.$model"
                    :class="{'is-invalid': $v.form.nombre_encargado.$error}"
                    placeholder="Ingresar nombre"
                  ></b-form-input>
                  <div v-if="$v.form.nombre_encargado.required.$invalid" class="invalid-feedback">
                    Debe ingresar el nombre del encargado
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    v-model.trim="$v.form.contacto_encargado.$model"
                    :class="{'is-invalid': $v.form.contacto_encargado.$error}"
                    placeholder="Ingresar telefono"
                  ></b-form-input>
                  <div v-if="$v.form.contacto_encargado.required.$invalid" class="invalid-feedback">
                    Debe ingresar el telefono
                  </div>
                  <div v-if="$v.form.contacto_encargado.numeric.$invalid" class="invalid-feedback">
                    Debe ingresar unicamente numeros
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="CUI:">
                  <b-form-input
                    v-model.trim="$v.form.cui_encargado.$model"
                    :class="{'is-invalid': $v.form.cui_encargado.$error}"
                    placeholder="Ingresar el CUI"
                  ></b-form-input>
                  <div v-if="$v.form.cui_encargado.required.$invalid" class="invalid-feedback">
                    Debe ingresar el CUI del encargado
                  </div>
                  <div v-if="$v.form.cui_encargado.$error" class="invalid-feedback">
                    El valor del CUI debe ser numerico.
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Estado civil:">
                  <v-select
                    name="type"
                    v-model="form.estado_civil_encargado"
                    :options="estados_civiles"
                    placeholder="Seleccione estado civil de encargado"
                  />
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Parentesco:">
                  <v-select
                    name="type"
                    v-model="form.parentesco_encargado"
                    :options="parentescos"
                    placeholder="Seleccione parentesco"
                  />
                </b-form-group>
              </b-col>
              <!-- columna -->
            </b-row>
            <b-row class="ml-2">
              <b-col md="4">
                <b-form-group label="Dirección de encargado:">
                  <b-form-input
                    v-model.trim="form.direccion_encargado"
                    placeholder="Ingresar dirección"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Profesión u oficio de encargado:">
                  <b-form-input
                    v-model.trim="form.profesion_encargado"
                    placeholder="Ingresar profesión u oficio"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            </b-tab>
            <b-tab title="Cónyugue">
              <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Nombre:">
                  <b-form-input
                    v-model.trim="form.nombre_conyuge"
                    placeholder="Ingresar nombre de conyuge"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    v-model.trim="form.telefono_conyuge"
                    placeholder="Ingresar telefono de conyuge"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="4">
                <b-form-group label="Dirección de conyuge:">
                  <b-form-input
                    v-model.trim="form.direccion_conyuge"
                    placeholder="Ingresar dirección de conyuge"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <!-- columna -->
            </b-row>
          </b-tab>
          </b-tabs>
        </div>
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
    <b-modal id="modal-1-habitacion" ref="modal-1-habitacion" title="Asignar habitación" size="xl">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <template>
        <div>
          <b-card>
            <b-card-body>
                <b-row class="ml-8">
                    <b-col md="4">
                        <b-form-group label="Fecha de ingreso:">
                        <b-form-input
                            type="date"
                            v-model.trim="$v.form.fecha.$model"
                            :class="{'is-invalid': $v.form.fecha.$error}"
                            placeholder="Ingresar fecha de ingreso"
                        ></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col md="4">
                        <b-form-group label="Hora de ingreso:">
                        <b-form-input
                            type="time"
                            v-model.trim="$v.form.hora.$model"
                            :class="{'is-invalid': $v.form.hora.$error}"
                            placeholder="Ingresar hora de ingreso"
                        ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row  class="ml-9">
                    <b-col md="3">
                        <b-form-group label="Área a la que ingresa:">
                        <b-form-radio
                            v-model="form.selectedOption"
                            value="hospi"
                            name="customRadio1"
                        >Hospitalización</b-form-radio>
                        <b-form-radio
                            v-model="form.selectedOption"
                            value="emergencia"
                            name="customRadio1"
                        >Emergencia</b-form-radio>
                        <b-form-radio
                            v-model="form.selectedOption"
                            value="quirofano"
                            name="customRadio1"
                        >Quirófano</b-form-radio>
                        <b-form-radio
                            v-model="form.selectedOption"
                            value="intensivo"
                            name="customRadio1"
                        >Intensivo</b-form-radio>
                        </b-form-group>
                    </b-col>
                    <b-col md="3">
                        <b-form-group label="Paciente:">
                        <b-form-radio
                            v-model="form.tipo_paciente"
                            value="0"
                            name="customRadio"
                            @change="getHabitaciones(form.tipo_paciente)"
                        >Normal</b-form-radio>
                        <b-form-radio
                            v-model="form.tipo_paciente"
                            value="1"
                            name="customRadio"
                            @change="getHabitaciones(form.tipo_paciente)"
                        >Ambulatorio</b-form-radio>
                        </b-form-group>
                    </b-col>
                    <b-col md="7">
                        <b-form-group label="Cuartos">
                          <div v-for="(tipo, index) in tiposHabitaciones" :key="tipo">
                            <b-row>
                              <b-col cols="4">
                                <h6 v-if="(form.estudioDeSueño != 1 && form.estudioDeSueño != 2) || index == 2" class="mt-2">{{ NombreHabitaciones[index] }}</h6>
                                  <b-form-checkbox
                                    v-if="form.selectedOption == 'hospi'"
                                    v-model="form.estudioDeSueño"
                                    value="1"
                                    class="mt-2 mb-4"
                                  >
                                    Estudio de sueño
                                  </b-form-checkbox>
                                  <b-form-checkbox
                                    v-if="form.selectedOption == 'hospi'"
                                    v-model="form.estudioDeSueño"
                                    value="2"
                                    class="mt-2 mb-4"
                                  >
                                    Quimioterapia
                                  </b-form-checkbox>
                              </b-col>
                              <b-col
                                v-for="habitacion in habitacionesPorTipo(tipo)"
                                :key="habitacion.id"
                                cols="2"
                              >
                                <b-button
                                  :variant="getButtonVariant(habitacion)"
                                  @click="form.habitacion = habitacion.id"
                                  class="mb-4 room-button"
                                  :class="{ 'disabled-room': habitacion.estado !== 1 }"
                                  v-b-tooltip.hover="{
                                    title: getRoomTooltip(habitacion.estado)
                                  }"
                                  block
                                >
                                 {{ habitacion.numero }}
                                </b-button>
                              </b-col>
                            </b-row>
                          </div>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-card-body>
          </b-card>
        </div>
      </template>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="
          onRoomAssignment()
        "
          >Asignar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-1-habitacion')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-medico" ref="modal-3-medico" title="Asignar médico" size="md">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <template>
        <div>
          <b-card>
            <b-card-body>
              <v-select
                name="type"
                v-model = "selectedDoctor"
                :options="doctors"
                :reduce="doc => doc.value"
                placeholder="Seleccione un médico"
                label='text'
                @search="onSearchMedicos"/>
            </b-card-body>
          </b-card>
        </div>
      </template>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="
          onDoctorAssignment()
        "
          >Asignar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-medico')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Expedientes</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
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
                <button v-if="props.rowData.estado === 1" type="button" class="btn btn-success" disabled>INGRESADO EN HOSPITAL</button>
                <button v-if="props.rowData.estado === 2" type="button" class="btn btn-warning" disabled>EGRESADO</button>
                <button v-if="props.rowData.estado === 3" type="button" class="btn btn-success" disabled>INGRESADO EN QUIRÓFANO</button>
                <button v-if="props.rowData.estado === 4" type="button" class="btn btn-success" disabled>INGRESADO EN INTENSIVO</button>
                <button v-if="props.rowData.estado === 5" type="button" class="btn btn-success" disabled>INGRESADO EN EMERGENCIA</button>
                <button v-if="props.rowData.estado === 6" type="button" class="btn btn-dark" disabled>DESAHUCIADO</button>
                <button v-if="props.rowData.estado === 7" type="button" class="btn btn-dark" disabled>ALTA MÉDICA</button>
                <button v-if="props.rowData.estado === 8" type="button" class="btn btn-dark" disabled>EGRESO CONTRAINDICADO</button>
                <button v-if="props.rowData.estado === 9" type="button" class="btn btn-dark" disabled>REFERIDO A OTRA UBICACIÓN</button>
                <button v-if="props.rowData.estado === 10" type="button" class="btn btn-dark" disabled>EXPEDIENTE Y ASIGNACIÓN INCOMPLETOS</button>
                <button v-if="props.rowData.estado === 11" type="button" class="btn btn-dark" disabled>EXPEDIENTE INCOMPLETO</button>
                <button v-if="props.rowData.estado === 0" type="button" class="btn btn-dark" disabled>FALLECIDO</button>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <b-button-group>
                    <b-button
                        v-b-tooltip.top="'Asignar habitación'"
                        @click="setData(props.rowData)
                        $bvModal.show('modal-1-habitacion')
                        getDoctors()"
                        class="mb-2 mt-2 button-spacing"
                        size="sm"
                        variant="success"
                        :disabled="!hasPermission([5])"
                    >
                        Asignar habitación
                    </b-button>
                    <b-button
                        v-b-tooltip.top="'Asignar médico'"
                        @click="setData(props.rowData)
                        $bvModal.show('modal-3-medico')
                        getDoctors()"
                        class="mb-2 mt-2 button-spacing"
                        size="sm"
                        variant="dark"
                        :disabled="!hasPermission([5])"
                    >
                        Asignar médico
                    </b-button>
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
import { helpers, numeric, required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'Asignar',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    this.getHabitaciones(0)
    this.form.id_usuario = this.currentUser.uid
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      from: 0,
      totalSUM: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      form: {
        id: 0,
        name: '',
        nombre: '',
        apellidos: '',
        expediente: '',
        casada: '',
        nacimiento: null,
        cui: null,
        nacionalidad: null,
        telefono: '',
        direccion: '',
        generos: '',
        nombre_encargado: '',
        contacto_encargado: '',
        parentesco_encargado: '',
        state: 1,
        id_usuario: null,
        estado_civil: null,
        profesion: '',
        nombre_madre: '',
        nombre_padre: '',
        lugar_nacimiento: '',
        estado_civil_encargado: null,
        profesion_encargado: '',
        direccion_encargado: '',
        cui_encargado: '',
        nombre_conyuge: '',
        direccion_conyuge: '',
        telefono_conyuge: '',
        selectedOption: 'hospi',
        assignedDoctor: 0,
        tipo_paciente: '0',
        motivo: ' ',
        fecha: null,
        hora: null,
        habitacion: null,
        estudioDeSueño: 0
      },
      selectedDoctor: [],
      habitaciones: [],
      nacionalidades: ['Guatemala', 'El Salvador', 'México', 'Honduras', 'Belice', 'Otro'],
      generos: ['Masculino', 'Femenino'],
      parentescos: ['Padre/Madre', 'Hermano/a', 'Hijo/a', 'Cónyuge', 'Otro'],
      estados_civiles: ['Soltero/a', 'Casado/a', 'Viudo/a', 'Separado/a', 'Divorciado/a', 'Otro'],
      doctors: [],
      totPagado: 0,
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      selectedAccount: null,
      cuentas: [],
      selectedTrasOption: 4,
      selectedPayment: [],
      fieldsAccounts: [
        {
          key: 'numero',
          label: 'Numero',
          sortable: true
        },
        {
          key: 'motivo',
          label: 'Motivo',
          sortable: true
        },
        {
          key: 'pendiente_de_pago',
          label: 'Total a pagar',
          sortable: true
        },
        {
          key: 'seleccion',
          label: 'Selección',
          sortable: true
        }
      ],
      paymentOptions: [
        { text: 'Efectivo', value: 1 },
        { text: 'Tarjeta', value: 2 },
        { text: 'Depósito', value: 3 },
        { text: 'Cheque', value: 4 },
        { text: 'Seguro', value: 5 }
      ],
      paymentType: {
        Efectivo: 0,
        Tarjeta: 0,
        Deposito: 0,
        Cheque: 0,
        Seguro: 0
      },
      paymentSum: 0,
      totalPayment: 0,
      apiBase: apiUrl + '/expedientes/list',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'nombres',
          sortField: 'nombres',
          title: 'Nombre',
          dataClass: 'list-item-heading'
        },
        {
          name: 'apellidos',
          sortField: 'apellidos',
          title: 'Apellidos',
          dataClass: 'list-item-heading'
        },
        {
          name: 'expediente',
          sortField: 'expediente',
          title: 'Expediente',
          dataClass: 'list-item-heading'
        },
        {
          name: 'medico.nombre',
          title: 'Médico asignado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nacimiento',
          sortField: 'nacimiento',
          title: 'Fecha de nacimiento',
          dataClass: 'list-item-heading'
        },
        {
          name: 'edad',
          title: 'Edad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'genero',
          sortField: 'genero',
          title: 'Género',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_encargado',
          sortField: 'nombre_encargado',
          title: 'Nombre de encargado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'contacto_encargado',
          sortField: 'contacto_encargado',
          title: 'Contacto de encargado',
          dataClass: 'list-item-heading'
        },
        {
          name: '__slot:estado',
          title: 'Estado',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        }
      ],
      tiposHabitaciones: ['Privada', 'Especial', 'Semi-privada', 'Intensivo', 'Intermedio'],
      NombreHabitaciones: ['Cuartos Privados', 'Cuartos Especiales', 'Cuartos Semi-privados', 'Intensivo', 'Intermedio']
    }
  },
  validations () {
    return {
      form: {
        nombre: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        apellidos: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        telefono: {
          required, numeric
        },
        nacimiento: {
          required
        },
        cui: {
          numeric, required
        },
        direccion: {
          required
        },
        nombre_encargado: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        contacto_encargado: {
          required,
          numeric
        },
        cui_encargado: {
          required, numeric
        },
        telefono_conyuge: {
          numeric
        },
        fecha: {
          required
        },
        hora: {
          required
        },
        habitacion: {
          required
        }
      }
    }
  },
  computed: {
    habitacionesPorTipo () {
      return (tipo) => {
        return this.habitaciones.filter(habitacion => habitacion.tipo.toUpperCase() === tipo.toUpperCase())
      }
    },
    ...mapGetters({
      currentUser: 'currentUser'
    })
  },
  methods: {
    getButtonVariant (habitacion) {
      if (this.form.habitacion === habitacion.id) return 'primary'
      return habitacion.estado === 1 ? 'success' : 'outline-secondary'
    },
    getRoomTooltip (estado) {
      const status = {
        0: 'Deshabilitada',
        1: 'Disponible',
        2: 'Ocupada'
      }
      return status[estado] || 'No disponible'
    },
    hasPermission (blockedRoles = []) {
      return !blockedRoles.includes(this.currentUser.user_type)
    },
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'update': {
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-expediente'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'assignRoom': {
          this.$refs['modal-1-habitacion'].hide()
          break
        }
        case 'assignDoctor': {
          this.$refs['modal-3-medico'].hide()
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
    calcularEdad (Fecha) {
      if (!Fecha) return ''
      const FECHA = moment(Fecha, 'DD-MM-YYYY').format('YYYY-MM-DD')
      const hoy = new Date()
      const nacimiento = new Date(FECHA)
      let edad = hoy.getFullYear() - nacimiento.getFullYear()
      const mesCumpleanos = nacimiento.getMonth()
      const diaCumpleanos = nacimiento.getDate()

      if (hoy.getMonth() < mesCumpleanos || (hoy.getMonth() === mesCumpleanos && hoy.getDate() < diaCumpleanos)) {
        edad--
      }
      return edad
    },
    setData (data) {
      this.form.id = data.id
      this.form.name = data.nombres + ' ' + data.apellidos
      this.form.nombre = data.nombres
      this.form.apellidos = data.apellidos
      this.form.casada = data.casada
      this.form.nacimiento = data.nacimiento
      this.form.cui = data.cui
      this.form.nacionalidad = data.nacionalidad
      this.form.telefono = data.telefono
      this.form.direccion = data.direccion
      this.form.generos = data.generos
      this.form.nombre_encargado = data.nombre_encargado
      this.form.contacto_encargado = data.contacto_encargado
      this.form.parentesco_encargado = data.parentesco_encargado
      this.form.estado_civil = data.estado_civil
      this.form.profesion = data.profesion
      this.form.nombre_madre = data.nombre_madre
      this.form.nombre_padre = data.nombre_padre
      this.form.lugar_nacimiento = data.lugar_nacimiento
      this.form.estado_civil_encargado = data.estado_civil_encargado
      this.form.cui_encargado = data.cui_encargado
      this.form.profesion_encargado = data.profesion_encargado
      this.form.nombre_conyuge = data.nombre_conyuge
      this.form.direccion_conyuge = data.direccion_conyuge
      this.form.telefono_conyuge = data.telefono_conyuge
      this.form.expediente = data.expediente
      this.form.state = data.estado
      this.form.id = data.id
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      this.form.fecha = `${yyyy}-${mm}-${dd}`
      this.form.hora = today.toTimeString().split(' ')[0]
      this.getCuentas(data.id)
    },
    /* Guardar */
    onUpdate () {
      const me = this
      // this.$refs["modalSave"].hide();
      axios.put(apiUrl + '/expedientes/update', {
        form: me.form, user: me.currentUser.user })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el expediente ' + me.form.nombre + ' exitosamente'
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
      this.items = paginationData.data.map(item => {
        item.nacimiento = moment(item.nacimiento).format('DD/MM/YYYY')
        item.edad = this.calcularEdad(item.nacimiento)
        return {
          nacimiento: item.nacimiento,
          edad: item.edad
        }
      })
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
    getCuentas (num) {
      this.totalSUM = 0
      axios.get(apiUrl + '/cuentas/getByExp', {
        params: {
          id: num
        }
      }).then((response) => {
        this.totalSUM = response.data
          .map(item => item.pendiente_de_pago)
          .reduce((sum, value) => sum + value, 0)
        this.cuentas = response.data
      })
    },
    getDoctors (search, loading) {
      axios.get(apiUrl + '/medicos/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.doctors = response.data.map(medico => ({
          value: medico.id,
          text: medico.nombre
        }))
        loading(false)
      })
    },
    onSearchMedicos (search, loading) {
      if (search.length) {
        loading(true)
        this.getDoctors(search, loading)
      }
    },
    onPatientQuit () {
      this.paymentSum = parseFloat(this.paymentType.Efectivo) + parseFloat(this.paymentType.Tarjeta) + parseFloat(this.paymentType.Deposito) + parseFloat(this.paymentType.Cheque) + parseFloat(this.paymentType.Seguro)
      if (this.selectedAccount === null) {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      } else {
        let me = this
        axios.put(apiUrl + '/cuentas/deactivate',
          {
            id: this.selectedAccount,
            total_pagado: parseFloat(this.totPagado) + parseFloat(this.paymentSum),
            pendiente_de_pago: parseFloat(parseFloat(this.totalPayment) - parseFloat(this.paymentSum)),
            efectivo: this.paymentType.Efectivo,
            tarjeta: this.paymentType.Tarjeta,
            deposito: this.paymentType.Deposito,
            cheque: this.paymentType.Cheque,
            seguro: this.paymentType.Seguro,
            total: this.paymentSum,
            tipo: 'adelanto'
          })
          .then(
            this.selectedAccount = null,
            this.paymentType.Efectivo = 0,
            this.paymentType.Tarjeta = 0,
            this.paymentType.Deposito = 0,
            this.paymentType.Cheque = 0,
            this.paymentType.Seguro = 0,
            this.paymentSum = 0,
            me.alertVariant = 'info',
            me.showAlert(),
            me.alertText = 'Se ha pagado por adelantado la cuenta del paciente ' + me.form.name + ' exitosamente',
            me.$refs.vuetable.refresh(),
            me.$refs['modal-1-pago'].hide()
          )
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
    },
    onRowSelected (items) {
      this.selectedAccount = items[0].id
      this.totalPayment = items[0].pendiente_de_pago
      this.totPagado = items[0].total_pagado
    },
    onDoctorAssignment () {
      this.form.assignedDoctor = this.selectedDoctor
      axios.put(apiUrl + '/expedientes/assignDoctor', {
        form: this.form })
        .then((response) => {
          this.alertVariant = 'primary'
          this.showAlert()
          this.alertText = 'Se ha actualizado el expediente ' + this.form.expediente + ' exitosamente'
          this.$refs.vuetable.refresh()
          this.closeModal('assignDoctor')
        })
        .catch((error) => {
          this.alertVariant = 'danger'
          this.showAlertError()
          this.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('Error!', error)
        })
    },
    onRoomAssignment () {
      this.form.assignedDoctor = this.selectedDoctor
      axios.put(apiUrl + '/expedientes/assignRoom', {
        form: this.form })
        .then((response) => {
          this.alertVariant = 'primary'
          this.showAlert()
          this.alertText = 'Se ha actualizado el expediente ' + this.form.expediente + ' exitosamente'
          this.$refs.vuetable.refresh()
          this.getHabitaciones()
          this.form.habitacion = null
          this.closeModal('assignRoom')
        })
        .catch((error) => {
          this.alertVariant = 'danger'
          this.showAlertError()
          this.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('Error!', error)
        })
    },
    getHabitaciones (num) {
      axios.get(apiUrl + '/habitaciones/getAll', {
        params: {
          tipo: num
        }
      }).then((response) => {
        this.habitaciones = response.data
      })
    }
  }
}
</script>
<style>
  .disabled-room {
    background-color: #9e9e9e !important;
    border-color: #7d7d7d !important;
    color: white !important;
    cursor: not-allowed;
    opacity: 1 !important
  }

  .room-button:disabled {
    opacity: 1 !important
  }
</style>
