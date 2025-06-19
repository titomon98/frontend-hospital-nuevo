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
    <b-modal id="modal-traslado" ref="modal-traslado" title="Trasladar paciente">
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
        ¿Desea trasladar el paciente: {{ form.nombres }} ?
      </h6>
      <b-form @submit="$event.preventDefault()">
        <b-col >
          <b-form-group label="Área a la que desea trasladar:">
            <b-form-radio-group
                id="radio-group-2"
                v-model="selectedTrasOption"
                :options="optionsTraslado"
                name="radio-options"
              ></b-form-radio-group>
            <div v-if="selectedTrasOption==1 || selectedTrasOption==4">
              Habitación
              <v-select
              ref="selectHab"
              v-model="selectedHab"
              :options="habitaciones"
              label="numero"
              value="id"></v-select>
            </div>
          </b-form-group>
        </b-col>
      </b-form>
      <div>
          Ingrese un motivo para el traslado
        </div>
        <div>
          <b-input id="motivoTraslado" ref="motivoTraslado" v-model="motivoTrasladoEmergencia" />
        </div>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onRelocation()
                  this.selectedHab = null
          "
          >Ingresar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-traslado')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal size="lg" id="modal-add-receta" ref="modal-add-receta" title="Contenido de receta">
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
        <b-form-group label="Contenido:">
          <quill-editor v-model="form.receta" :options="editorOptions" class="custom-editor"></quill-editor>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="saveReceta()"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('add-receta')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal size="lg" id="modal-add-evolucion" ref="modal-add-evolucion" title="Evolución de paciente">
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
        <b-form-group label="Contenido:">
          <quill-editor v-model="form.evolucion" :options="editorOptions2" class="custom-editor"></quill-editor>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="saveEvolucion()"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('add-evolucion')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal size="lg" id="modal-add-orden" ref="modal-add-orden" title="Orden médica">
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
        <b-form-group label="Contenido:">
          <quill-editor v-model="form.orden" :options="editorOptions3" class="custom-editor"></quill-editor>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="saveOrden()"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('add-orden')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal size="lg" id="modal-ver-receta" ref="modal-ver-receta" :title="tituloVer">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <vuetable
          ref="vuetableRecetas"
          class="table-divided table-responsive order-with-arrow"
          :api-url="apiBaseReceta"
          :query-params="makeQueryParamsReceta"
          :per-page="perPage"
          :reactive-api-url="true"
          :fields="fieldsReceta"
          pagination-path
          @vuetable:pagination-data="onPaginationDataReceta"
        >
          <template slot="actions" slot-scope="props">
            <b-button-group>
              <b-button
                v-b-tooltip.top="'Generar voucher de pago'"
                @click="voucherData(props.rowData)"
                class="mb-2"
                size="sm"
                variant="outline-info"
                ><i :class="'fas fa-money-bill'"
              /></b-button>
            </b-button-group>
          </template>
        </vuetable>
        <vuetable-pagination-bootstrap
          ref="paginationReceta"
          @vuetable-pagination:change-page="onChangePageReceta"
        />
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('ver-receta')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('ver-receta')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-add-servicio" ref="modal-add-servicio" title="Añadir consumo de servicio">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError = 0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form @submit="$event.preventDefault()">
        <b-form-group label="Servicio a agregar:">
          <v-select
            name="servicio"
            v-model="servicio"
            :options="servicios"
            :filterable="false"
            placeholder="Seleccione un servicio a agregar"
            @search="onSearchServicios"
          >
            <template v-slot:option="option">
              {{ option.descripcion + ' - Precio: ' + option.precio }}
            </template>
            <template v-slot:selected-option="option">
              {{ option.descripcion + ' - Precio: ' + option.precio }}
            </template>
          </v-select>
        </b-form-group>
        <b-form-group label="Cantidad:">
          <b-form-input
            type="number"
            v-model="form.cantidad"
            placeholder="Ingrese la cantidad"
            min="1"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="saveServicio"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('add-servicio')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-ver-servicio" size="lg" ref="modal-ver-servicio" title="Ver servicios">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <vuetable
          ref="vuetableConsumos"
          class="table-divided table-responsive order-with-arrow"
          :api-url="apiBaseConsumo"
          :query-params="makeQueryParamsConsumo"
          :per-page="perPage"
          :reactive-api-url="true"
          :fields="fieldsConsumo"
          pagination-path
          @vuetable:pagination-data="onPaginationDataConsumo"
        >
          <template slot="actions" slot-scope="props">
            <b-button-group>
              <b-button
                v-b-tooltip.top="'Generar voucher de pago'"
                @click="voucherData(props.rowData)"
                class="mb-2"
                size="sm"
                variant="outline-info"
                ><i :class="'fas fa-money-bill'"
              /></b-button>
            </b-button-group>
          </template>
        </vuetable>
        <vuetable-pagination-bootstrap
          ref="paginationConsumo"
          @vuetable-pagination:change-page="onChangePageConsumo"
        />
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('ver-servicio')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('ver-servicio')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-ver-servicio2" size="lg" ref="modal-ver-servicio2" title="Ver servicios">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <vuetable
          ref="vuetableConsumos"
          class="table-divided table-responsive order-with-arrow"
          :api-url="apiBaseConsumo"
          :query-params="makeQueryParamsConsumo"
          :per-page="perPage"
          :reactive-api-url="true"
          :fields="fieldsConsumo2"
          pagination-path
          @vuetable:pagination-data="onPaginationDataConsumo"
        >
          <template slot="actions" slot-scope="props">
            <b-button-group>
              <b-button
                v-b-tooltip.top="'Generar voucher de pago'"
                @click="voucherData(props.rowData)"
                class="mb-2"
                size="sm"
                variant="outline-info"
                ><i :class="'fas fa-money-bill'"
              /></b-button>
            </b-button-group>
          </template>
        </vuetable>
        <vuetable-pagination-bootstrap
          ref="paginationConsumo"
          @vuetable-pagination:change-page="onChangePageConsumo"
        />
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('ver-servicio2')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('ver-servicio2')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-add-honorarios" size="lg" ref="modal-add-honorarios" title="Agregar honorarios a medico">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form  @submit="$event.preventDefault()">
        <b-form-group label="Seleccionar Medico">
          <v-select
            v-model="honorario.medico"
            :options="medicos"
            item-text="nombre"
            item-value="id"
            label="nombre"
            :filterable="false"
            placeholder="Seleccione un médico"
            @search="onSearchMedicos"
            required
          >
            <template v-slot:option="option">
              {{ option.nombre }}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ option.nombre }}
            </template>
          </v-select>
        </b-form-group>
        <b-form-group label="Descripción">
          <b-form-textarea
            v-model="honorario.descripcion"
            placeholder="Ingrese una descripción"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group label="Total de honorarios">
          <b-form-input
            v-model.trim="honorario.total"
            placeholder="Ingresar Total Honorarios"
            type="number"
            required
          ></b-form-input>
        </b-form-group>
      </b-form>
        <template #modal-footer>
          <b-button variant="primary" @click="agregarHonorario()">Guardar</b-button>
          <b-button variant="danger" @click="closeModal('add-honorarios')">Cancelar</b-button>
        </template>
    </b-modal>
    <b-modal id="modal-ver-honorarios" size="lg" ref="modal-ver-honorarios" title="Ver honorarios">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-table striped hover :items="honorarios" :fields="fieldsHonorarios">
        <!-- Nombre del Médico -->
        <template #cell(medico)="row">
          {{ row.item.medico }}
        </template>

        <!-- Campo editable para Total -->
        <template #cell(total)="row">
          <b-form-input
            v-model="row.item.total"
            type="number"
            @change="updateTotal(row.item)"
          ></b-form-input>
        </template>
      </b-table>

      <b-pagination
        v-if="pagination.total > 0"
        v-model="pagination.currentPage"
        :total-rows="pagination.total"
        :per-page="pagination.perPage"
        @change="onChangePageHonorario"
      ></b-pagination>

      <template #modal-footer>
        <b-button variant="danger" @click="closeModal('ver-honorarios')">Cerrar</b-button>
      </template>
    </b-modal>
    <b-modal id="modal-sala-operaciones" size="lg" ref="modal-sala-operaciones" title="Servicio sala de operaciones">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-row class="ml-2">
            <b-col md="6">
              <b-form-group label="Categoria sala operaciones">
                <b-form-radio v-model="salaOperaciones.categoria" value="Cirugia menor" @change="changeCheck" name="customRadio1">Cirugía menor</b-form-radio>
                <b-form-radio v-model="salaOperaciones.categoria" value="Cirugia media" @change="changeCheck" name="customRadio1">Cirugía media</b-form-radio>
                <b-form-radio v-model="salaOperaciones.categoria" value="Cirugia mayor" @change="changeCheck" name="customRadio1">Cirugía mayor </b-form-radio>
                <b-form-radio v-model="salaOperaciones.categoria" value="Parto" @change="changeCheck" name="customRadio1">Parto</b-form-radio>
                <b-form-radio v-model="salaOperaciones.categoria" value="Legrado" @change="changeCheck" name="customRadio1">Legrado</b-form-radio>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group v-if="isCirugiaMayorOMedia" label="Cobro Oximetro / Cauterio">
                <b-form-checkbox v-model="salaOperaciones.oximetro" :disabled="isCirugiaMayorOMedia">Oxímetro </b-form-checkbox>
                <b-form-checkbox v-model="salaOperaciones.cauterio" :disabled="isCirugiaMayorOMedia">Cauterio </b-form-checkbox>
              </b-form-group>
              <b-form-group v-if="!isCirugiaMayorOMedia" label="Oxímetro / Cauterio">
                <b-form-checkbox v-model="salaOperaciones.oximetro" >Oxímetro</b-form-checkbox>
                <b-form-checkbox v-model="salaOperaciones.cauterio" >Cauterio</b-form-checkbox>
              </b-form-group>
              <b-form-group label="Duración Horas : Minutos">
                <b-row>
                  <b-col md="6">
                    <b-form-input type="number" v-model="salaOperaciones.horas" min="0" placeholder="Horas"></b-form-input>
                  </b-col>
                  <b-col md="6">
                    <b-form-input type="number"  v-model.trim="$v.salaOperaciones.minutos.$model" :min=1 :max=59 placeholder="Minutos"></b-form-input>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
      </b-row>
      <template #modal-footer>
        <div class="ml-auto"> <span class="mr-2">Total: Q{{ TotalAPagar }}</span></div>
          <b-button variant="primary" @click="addSalaOperaciones()">Cobrar</b-button>
          <b-button variant="danger" @click="closeModal('sala-operaciones')">Cancelar</b-button>
        </template>
    </b-modal>
    <b-modal id="modal-1-movimiento" size="lg" ref="modal-1-movimiento" title="Agregar Consumo" @shown="openModal2">
      <!-- Alerta -->
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>

      <b-form @submit.prevent>
        <!-- Selección de tipo de insumo -->
        <b-form-group label="Agregar Insumo:">
          <b-row md="3" class="ml-5 mt-negativo-r1">
            <input type="radio" id="medicamento" value="0" v-model="$v.form.selected_insumo.$model" @change="onSelectChange"/>
            <label for="medicamento" class="mt-2 ml-1">Medicamento</label>
          </b-row>
          <b-row md="3" class="ml-5 mt-negativo">
            <input type="radio" id="quirurgico" value="1" v-model="$v.form.selected_insumo.$model" @change="onSelectChange"/>
            <label for="quirurgico" class="mt-2 ml-1">Quirúrgico</label>
          </b-row>
          <b-row md="3" class="ml-5 mt-negativo">
            <input type="radio" id="uso_comun" value="2" v-model="$v.form.selected_insumo.$model" @change="onSelectChange" />
            <label for="uso_comun" class="mt-2 ml-1">Uso común</label>
          </b-row>

          <!-- Selector de insumo -->
          <v-select
            name="medicamentos"
            v-model.trim="$v.formMe.id_medicine.$model"
            :options="insumosActuales"
            :filterable="true"
            :reduce="med => med.value"
            :state="!$v.formMe.id_medicine.$error"
            placeholder="Seleccione el insumo"
            label="text"
            @input="onSeleccionarInsumo"
          ></v-select>
        </b-form-group>

        <!-- Tabla de insumos seleccionados -->
        <h5 class="mt-3">INSUMOS SELECCIONADOS</h5>
        <b-table
          striped
          hover
          :items="consumosTemporales"
          :fields="['nombre', 'cantidad', 'existencias', 'acciones']"
          small
        >
          <template #cell(cantidad)="row">
            <b-form-input
              type="number"
              v-model="row.item.cantidad"
              :min="1"
              :max="row.item.existencias"
              placeholder="Cantidad"
            ></b-form-input>
          </template>

          <template #cell(acciones)="row">
            <b-button variant="danger" size="sm" @click="eliminarDeLista(row.item.id)">Eliminar</b-button>
          </template>
        </b-table>

        <!-- Tabla de consumos ya registrados -->
        <h5 class="mt-4">CONSUMOS REALIZADOS</h5>
        <b-tabs content-class="mt-3">
          <b-tab title="Medicamento" active>
            <vuetable
              ref="vuetableConsumoInsumos"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiBaseConsumoMedicamento"
              :query-params="makeQueryParamsConsumoInsumo"
               data-path="data"
               pagination-path=""
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumoMedicamento"
            ></vuetable>
            <vuetable-pagination-bootstrap
              ref="paginationConsumo"
              @vuetable-pagination:change-page="onChangePageConsumo"
            />
          </b-tab>

          <b-tab title="Quirúrgico">
            <vuetable
              ref="vuetableConsumoQuirurgicos"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiBaseConsumoQuirurgico"
              :query-params="makeQueryParamsConsumoInsumo"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumoQuirurgico"
            ></vuetable>
            <vuetable-pagination-bootstrap
              ref="paginationConsumo"
              @vuetable-pagination:change-page="onChangePageConsumo"
            />
          </b-tab>

          <b-tab title="Común">
            <vuetable
              ref="vuetableConsumoComunes"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiBaseConsumoComun"
              :query-params="makeQueryParamsConsumoInsumo"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumo"
            ></vuetable>
            <vuetable-pagination-bootstrap
              ref="paginationConsumo"
              @vuetable-pagination:change-page="onChangePageConsumo"
            />
          </b-tab>
        </b-tabs>
      </b-form>

      <!-- Footer -->
      <template #modal-footer>
        <b-button variant="primary" @click="onSave">Guardar</b-button>
        <b-button variant="danger" @click="closeModal('save')">Cancelar</b-button>
      </template>
    </b-modal>
    <b-modal id="modal-1-movimiento2" size="lg" ref="modal-1-movimiento2" title="Agregar Consumo" @shown="openModal2">
      <!-- Alerta -->
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>

      <b-form @submit.prevent>
        <!-- Selección de tipo de insumo -->
        <b-form-group label="Agregar Insumo:">
          <b-row md="3" class="ml-5 mt-negativo-r1">
            <input type="radio" id="medicamento" value="0" v-model="$v.form.selected_insumo.$model" @change="onSelectChange"/>
            <label for="medicamento" class="mt-2 ml-1">Medicamento</label>
          </b-row>
          <b-row md="3" class="ml-5 mt-negativo">
            <input type="radio" id="quirurgico" value="1" v-model="$v.form.selected_insumo.$model" @change="onSelectChange"/>
            <label for="quirurgico" class="mt-2 ml-1">Quirúrgico</label>
          </b-row>
          <b-row md="3" class="ml-5 mt-negativo">
            <input type="radio" id="uso_comun" value="2" v-model="$v.form.selected_insumo.$model" @change="onSelectChange" />
            <label for="uso_comun" class="mt-2 ml-1">Uso común</label>
          </b-row>

          <!-- Selector de insumo -->
          <v-select
            name="medicamentos"
            v-model.trim="$v.formMe.id_medicine.$model"
            :options="insumosActuales"
            :filterable="true"
            :reduce="med => med.value"
            :state="!$v.formMe.id_medicine.$error"
            placeholder="Seleccione el insumo"
            label="text"
            @input="onSeleccionarInsumo"
          ></v-select>
        </b-form-group>

        <!-- Tabla de insumos seleccionados -->
        <h5 class="mt-3">INSUMOS SELECCIONADOS</h5>
        <b-table
          striped
          hover
          :items="consumosTemporales"
          :fields="['nombre', 'cantidad', 'existencias', 'acciones']"
          small
        >
          <template #cell(cantidad)="row">
            <b-form-input
              type="number"
              v-model="row.item.cantidad"
              :min="1"
              :max="row.item.existencias"
              placeholder="Cantidad"
            ></b-form-input>
          </template>

          <template #cell(acciones)="row">
            <b-button variant="danger" size="sm" @click="eliminarDeLista(row.item.id)">Eliminar</b-button>
          </template>
        </b-table>

        <!-- Tabla de consumos ya registrados -->
        <h5 class="mt-4">CONSUMOS REALIZADOS</h5>
        <b-tabs content-class="mt-3">
          <b-tab title="Medicamento" active>
            <vuetable
              ref="vuetableConsumoInsumos"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiBaseConsumoMedicamento"
              :query-params="makeQueryParamsConsumoInsumo"
               data-path="data"
               pagination-path=""
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumoMedicamento2"
            ></vuetable>
            <vuetable-pagination-bootstrap
              ref="paginationConsumo"
              @vuetable-pagination:change-page="onChangePageConsumo"
            />
          </b-tab>

          <b-tab title="Quirúrgico">
            <vuetable
              ref="vuetableConsumoQuirurgicos"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiBaseConsumoQuirurgico"
              :query-params="makeQueryParamsConsumoInsumo"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumoQuirurgico2"
            ></vuetable>
            <vuetable-pagination-bootstrap
              ref="paginationConsumo"
              @vuetable-pagination:change-page="onChangePageConsumo"
            />
          </b-tab>

          <b-tab title="Común">
            <vuetable
              ref="vuetableConsumoComunes"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiBaseConsumoComun"
              :query-params="makeQueryParamsConsumoInsumo"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumo2"
            ></vuetable>
            <vuetable-pagination-bootstrap
              ref="paginationConsumo"
              @vuetable-pagination:change-page="onChangePageConsumo"
            />
          </b-tab>
        </b-tabs>
      </b-form>

      <!-- Footer -->
      <template #modal-footer>
        <b-button variant="primary" @click="onSave">Guardar</b-button>
        <b-button variant="danger" @click="closeModal('save2')">Cancelar</b-button>
      </template>
    </b-modal>
    <b-modal id="modal_agregar" size="xl" ref="modal_agregar" title="Ingresar nuevo examen">
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
          <b-col md="3">
            <b-form-group label="Nombre del medico:">
              <v-select
                name="medico"
                v-model="formExamen.comision"
                :options="medicos"
                :filterable="false"
                placeholder="Seleccione el médico"
                @search="onSearchMedicos"
              >
                <template v-slot:option="option">
                  {{ option.nombre}}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{option.nombre}}
                </template>
              </v-select>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Total:">
              <b-form-input
                disabled
                v-model="formExamen.total"
                placeholder="Ingresar el total"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="3">
            <b-form-group label="Numero Muestra:">
              <b-form-input
                v-model="formExamen.numero_muestra"
                placeholder="Ingresar el numero de muestra"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-form-group label="Edad:">
              <b-form-input
              type="number"
              v-model.trim="formExamen.edad"
              placeholder="Ingresar la edad del paciente"
              ></b-form-input>
            </b-form-group>
        </b-row>
        <b-row class="ml-2">
          <b-col md="4">
            <b-form-group label="Tipo de Examen:">
              <v-select
                name="type"
                v-model="selectedExamenAlmacenado"
                :options="examenes_almacenados"
                :filterable="false"
                placeholder="Seleccione el Examen"
                @search="onSearch_id_examenes_almacenados"
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
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="guardarExamenRealizado"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('modal_agregar')"
          >Cancelar</b-button
        >
      </template>
      <b-row>
      <b-col sm="12">
        <table class="table">
          <thead>
            <tr>
              <th>Acciones</th>
              <th>Nombre</th>
              <th>CUI</th>
              <th>Total a Pagar</th>
              <th>Celular</th>
              <th>Numero de Muestra</th>
              <th>Nombre de Encargado</th>
              <th>Pagado</th>
              <th>Por Pagar</th>
              <th>Examen Realizado</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in item_examenes" :key="row.id">
              <td>
                <b-button @click="addResultado(row.id, row.nombre_examen, row)" variant="success">Agregar resultado</b-button>
                <b-button @click="anular(row.id)" variant="danger">Anular Examen</b-button>
              </td>
              <td>{{ row.nombre }}</td>
              <td>{{ row.cui }}</td>
              <td>{{ row.total }}</td>
              <td>{{ row.whatsapp }}</td>
              <td>{{ row.numero_muestra }}</td>
              <td>{{ row.nombre_encargado }}</td>
              <td>{{ row.pagado }}</td>
              <td>{{ row.por_pagar }}</td>
              <td>{{ row.nombre_examen }}</td>
              <td>{{ row.fecha_hora }}</td>
            </tr>
          </tbody>
        </table>
      </b-col>
      </b-row>
    </b-modal>
    <b-modal id="modal-add-resultados" size="lg" ref="modal-add-resultados" title="Agregar Resultados">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form @submit.prevent="onSubmit">
        <b-table :items="this.camposResulado" :fields="this.fieldsCampos" striped hover small responsive>
          <template #cell(resultado)="data">
            <b-form-input
              v-model="data.item.resultado"
              type="text"
              placeholder="agregar el resultado"
            ></b-form-input>
          </template>
        </b-table>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidateResultado('save')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('resultado')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="reporteModal" title="Reporte de Cuenta Parcial" size="lg">
      <div class="modal-body">
        <p><strong>Total consumo de servicios:</strong> Q{{ reporte.ConsumoTotal }}</p>
        <p><strong>Total consumo de materiales comunes:</strong> Q{{ reporte.ConsumoComunTotal }}</p>
        <p><strong>Total consumo de medicamentos:</strong> Q{{ reporte.ConsumoMedicamentosTotal }}</p>
        <p><strong>Total consumo de materialesquirúrgicos:</strong> Q{{ reporte.ConsumoQuirurgicosTotal }}</p>
        <p><strong>Total de exámenes realizados:</strong> Q{{ reporte.ExamenesTotal }}</p>
        <p><strong>Total de servicios en sala de operaciones:</strong> Q{{ reporte.ServicioSalaOperacionesTotal }}</p>
        <hr />
        <p><strong><u>Total deuda:</u> Q{{ reporte.TotalDeuda }}</strong></p>
      </div>
      <template #modal-footer>
        <b-button variant="primary" @click="generarPDF_CuentaParcial">Generar PDF</b-button>
        <b-button variant="secondary" @click="$bvModal.hide('reporteModal')">Cerrar</b-button>
      </template>
    </b-modal>
    <b-modal id="HistorialCuenta" title="Historial de las Cuentas" size="lg">
      <div class="modal-body">
        <p><strong>Total consumo de servicios:</strong> Q{{ reporteHisotiral.ConsumoTotal }}</p>
        <p><strong>Total consumo de materiales comunes:</strong> Q{{ reporteHisotiral.ConsumoComunTotal }}</p>
        <p><strong>Total consumo de medicamentos:</strong> Q{{ reporteHisotiral.ConsumoMedicamentosTotal }}</p>
        <p><strong>Total consumo de materialesquirúrgicos:</strong> Q{{ reporteHisotiral.ConsumoQuirurgicosTotal }}</p>
        <p><strong>Total de exámenes realizados:</strong> Q{{ reporteHisotiral.ExamenesTotal }}</p>
        <p><strong>Total de servicios en sala de operaciones:</strong> Q{{ reporteHisotiral.ServicioSalaOperacionesTotal }}</p>
        <hr />
        <!-- <p><strong><u>Total deuda:</u> Q{{ reporteHisotiral.TotalDeuda }}</strong></p> -->
      </div>
      <template #modal-footer>
        <b-button variant="primary" @click="generarPDF_Historial">Generar PDF</b-button>
        <b-button variant="secondary" @click="$bvModal.hide('HistorialCuenta')">Cerrar</b-button>
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Quirófano</h4>
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
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <div class="button-container">
                  <b-button
                    @click="setData(props.rowData)
                    traslado(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Trasladar</b-button>

                  <b-button
                    @click="addReceta(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                    :disabled="!hasPermission([10])"
                  >Agregar receta</b-button>

                  <b-button
                  v-if="props.rowData.nombres !== 'PENDIENTE' "
                    @click="verReceta(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver recetas</b-button>

                  <b-button
                    @click="addServicio(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Agregar servicios</b-button>

                  <b-button
                  v-if="props.rowData.nombres !== 'PENDIENTE' "
                    @click="mostrarVerServicio(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver servicios</b-button>

                  <b-button
                    @click="showModal('modal-add-honorarios'); obtenerIdCuenta(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Agregar honorarios</b-button>

                  <b-button
                  v-if="props.rowData.nombres !== 'PENDIENTE' "
                   @click="showModal('modal-ver-honorarios'); getDataHonorarios(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver honorarios</b-button>

                  <b-button
                    @click="showModal('modal-sala-operaciones'); obtenerIdCuenta(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Sala Operaciones</b-button>

                   <b-button
                    v-b-tooltip.top="'Agregar consumo'"
                    @click="mostrarModalConsumos(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                   >Consumos</b-button>

                   <b-button
                    @click="showModal('modal_agregar'); ver_examen_realizado (props.rowData.cui); realizar_examen(props.rowData.id, props.rowData.nombres, props.rowData.apellidos, props.rowData.cui, props.rowData.telefono )"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                   >Agregar Examen</b-button>

                   <b-button
                    @click="generarReporteCuentaParcial(props.rowData.id, props.rowData.nombres, props.rowData.apellidos)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                    :disabled="!hasPermission([9, 10])"
                   >Cuenta parcial</b-button>

                   <b-button
                    @click="generarHistorialCuentas(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                    :disabled="!hasPermission([9, 10])"
                   >Historial Cuenta</b-button>

                   <b-button
                    @click="addEvolucion(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                    :disabled="!hasPermission([10])"
                  >Agregar evolución</b-button>

                  <b-button
                  v-if="props.rowData.nombres !== 'PENDIENTE' "
                    @click="verEvolucion(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Ver evolución</b-button>

                  <b-button
                    @click="addOrdenes(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                    :disabled="!hasPermission([10])"
                  >Agregar orden médica</b-button>

                  <b-button
                  v-if="props.rowData.nombres !== 'PENDIENTE' "
                    @click="verOrden(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Ver órdenes médicas</b-button>
                </div>
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
import { quillEditor } from 'vue-quill-editor'
import moment from 'moment'
import { mapGetters } from 'vuex'
import JsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'Quirofano',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading,
    quillEditor
  },
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    this.searchingMedicamentos()
    this.getHabitaciones(0)
  },
  mounted () {
    xray.index()
    this.cargarPreciosServicios()
  },
  data () {
    return {
      tituloVer: '',
      consumosTemporales: [],
      insumosActuales: [],
      tipoInsumoActual: '0',
      from: 0,
      to: 0,
      total: 0,
      editorOptions: {
        modules: {
          toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
          ]
        },
        placeholder: 'Escribir contenido de la receta',
        theme: 'snow'
      },
      editorOptions2: {
        modules: {
          toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
          ]
        },
        placeholder: 'Escribir la evolución',
        theme: 'snow'
      },
      editorOptions3: {
        modules: {
          toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
          ]
        },
        placeholder: 'Escribir la orden médica',
        theme: 'snow'
      },
      perPage: 5,
      search: '',
      existencias_selected_med: null,
      max_cant: 0,
      selectedTrasOption: 1,
      selectedHab: null,
      habitaciones: [],
      motivoTrasladoEmergencia: '',
      optionsTraslado: [
        { text: 'Emergencia', value: 5 },
        { text: 'Hospitalización', value: 1 },
        { text: 'Intensivos', value: 4 }
      ],
      form: {
        id: 0,
        name: '',
        state: 1,
        selectedOption: 'hospi',
        receta: null,
        evolucion: null,
        orden: null,
        nombres: '',
        id_receta: null,
        cantidad: null,
        selected_insumo: '0'
      },
      servicio: null,
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/expedientes/listQuirofano',
      apiBaseReceta: '',
      apiBaseConsumo: '',
      apiBaseConsumoMedicamento: '',
      apiBaseConsumoQuirurgico: '',
      apiBaseConsumoComun: '',
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
          sortField: 'medico.nombre',
          title: 'Médico tratante',
          dataClass: 'list-item-heading'
        },
        {
          name: 'habitacione.numero',
          title: 'Habitación',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_ingreso_reciente',
          sortField: 'fecha_ingreso_reciente',
          title: 'Fecha de ingreso',
          dataClass: 'list-item-heading'
        },
        {
          name: 'hora_ingreso_reciente',
          sortField: 'hora_ingreso_reciente',
          title: 'Hora de ingreso',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsReceta: [
        {
          name: 'contenido',
          sortField: 'contenido',
          title: 'Indicaciones',
          dataClass: 'list-item-heading'
        },
        {
          name: 'created_by',
          sortField: 'created_by',
          title: 'Creado por',
          dataClass: 'list-item-heading'
        },
        {
          name: 'createdAt',
          sortField: 'createdAt',
          title: 'Fecha de creación',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumo: [
        {
          name: 'servicio.descripcion',
          sortField: 'servicio.descripcion',
          title: 'Nombre del servicio',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'subtotal',
          sortField: 'subtotal',
          title: 'Subtotal',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Lugar de consumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'createdAt',
          sortField: 'createdAt',
          title: 'Creación',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumo2: [
        {
          name: 'servicio.descripcion',
          sortField: 'servicio.descripcion',
          title: 'Nombre del servicio',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Lugar de consumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'createdAt',
          sortField: 'createdAt',
          title: 'Creación',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumoInsumo: [
        {
          name: 'comune.nombre',
          sortField: 'comune.nombre',
          title: 'Nombre del insumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_venta',
          sortField: 'precio_venta',
          title: 'Precio unitario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Subtotal',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumoInsumoQuirurgico: [
        {
          name: 'quirurgico.nombre',
          sortField: 'quirurgico.nombre',
          title: 'Nombre del insumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_venta',
          sortField: 'precio_venta',
          title: 'Precio unitario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Subtotal',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumoInsumoMedicamento: [
        {
          name: 'medicamento.nombre',
          sortField: 'medicamento.nombre',
          title: 'Nombre del insumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_venta',
          sortField: 'precio_venta',
          title: 'Precio unitario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Subtotal',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumoInsumo2: [
        {
          name: 'comune.nombre',
          sortField: 'comune.nombre',
          title: 'Nombre del insumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumoInsumoQuirurgico2: [
        {
          name: 'quirurgico.nombre',
          sortField: 'quirurgico.nombre',
          title: 'Nombre del insumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumoInsumoMedicamento2: [
        {
          name: 'medicamento.nombre',
          sortField: 'medicamento.nombre',
          title: 'Nombre del insumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        }
      ],
      servicios: [],
      honorario: {
        medico: null,
        lugar: 'Quirófano',
        descripcion: '',
        total: null
      },
      idCuentaSeleccionada: null,
      medicos: [],
      apiBaseHonorarios: apiUrl + '/detalle_honorarios',
      honorarios: [],
      fieldsHonorarios: [
        { key: 'medico', label: 'Nombre del Médico' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'total', label: 'Total' },
        { key: 'createdAt', label: 'Fecha y Hora' },
        { key: 'updated_by', label: 'Creado por' }
      ],
      pagination: {
        currentPage: 1,
        perPage: 10,
        total: 0
      },
      currentExpedienteId: null,
      salaOperaciones: {
        oximetro: false,
        cauterio: false,
        horas: null,
        minutos: null,
        categoria: null
      },
      preciosCategorias: {},
      preciosServicios: {},
      TotalAPagar: 0,
      tiempoBase: 150,
      tarifaHoraExtra: 0,
      Quirurgicos: [],
      formQui: {
        id_cuenta: 0,
        cantidad: 0,
        quirurgico: null,
        state: 1,
        movimiento: 'SALIDAQ'
      },
      medicamentos: [],
      formMe: {
        id_cuenta: 0,
        id_medicine: null,
        cantidad: null,
        medicamento: null,
        state: 1,
        precio_venta: 0,
        existencias_actuales: null,
        movimiento: 'SALIDAH'
      },
      Comunes: [],
      formCom: {
        id_cuenta: 0,
        cantidad: 0,
        comun: null,
        state: 1,
        movimiento: 'SALIDAQ'
      },
      /* AREA DE EXAMENES */
      camposResulado: [],
      item_examenes: [],
      examenes_almacenados: [],
      encargados: [],
      formExamen: {
        id: 0,
        nombre: '',
        apellido: '',
        cui: 0,
        edad: 0,
        comision: '',
        total: 0,
        correo: '',
        whatsapp: '',
        numero_muestra: 0,
        existencia_actual: 0,
        referido: 'Quirofano Enfermeria',
        id_encargado: null,
        pagado: 0,
        por_pagar: 0,
        id_examenes_almacenados: null,
        NewExpediente: false,
        id_expediente: 0,
        examenExterior: false
      },
      selectedExamenAlmacenado: null,
      fromExamenes: 0,
      toExamenes: 0,
      totalExamenes: 0,
      perPageExamenes: 5,
      searchExamenes: '',
      fechaDesdeExamenes: null,
      fechaHastaExamenes: null,
      apiBaseExamenes: null,
      formResultado: {
        id: null,
        id_campo: '',
        id_tipo: '',
        resultado: null,
        alarma: ''
      },
      fieldsCampos: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'unidades', label: 'Unidades' },
        { key: 'resultado', label: 'Resultado' }
      ],
      fieldsExamenes: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'nombre',
          sortField: 'nombre',
          title: 'Nombre',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cui',
          sortField: 'cui',
          title: 'CUI',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total a Pagar',
          dataClass: 'list-item-heading'
        },
        {
          name: 'whatsapp',
          sortField: 'whatsapp',
          title: 'Celular',
          dataClass: 'list-item-heading'
        },
        {
          name: 'numero_muestra',
          sortField: 'numero_muestra',
          title: 'Numero de Muestra',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_encargago',
          sortField: 'nombre_encargago',
          title: 'Nombre de Encargado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'pagado',
          sortField: 'pagado',
          title: 'Pagado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'por_pagar',
          sortField: 'por_pagar',
          title: 'Por Pagar',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_examen',
          sortField: 'nombre_examen',
          title: 'Examen Realizado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_hora',
          sortField: 'fecha_hora',
          title: 'Fecha y Hora',
          dataClass: 'list-item-heading'
        }
      ],
      /* AREA DE REPORTES */
      reporte: {
        ConsumoTotal: '0.00',
        ConsumoComunTotal: '0.00',
        ConsumoMedicamentosTotal: '0.00',
        ConsumoQuirurgicosTotal: '0.00',
        ExamenesTotal: '0.00',
        ServicioSalaOperacionesTotal: '0.00',
        TotalDeuda: '0.00'
      },
      dataPDFsumario: null,
      nombrePaciente: null,
      fechaIngreso: null,
      dataPDF_Historial: null,
      reporteHisotiral: {
        ConsumoTotal: '0.00',
        ConsumoComunTotal: '0.00',
        ConsumoMedicamentosTotal: '0.00',
        ConsumoQuirurgicosTotal: '0.00',
        ExamenesTotal: '0.00',
        ServicioSalaOperacionesTotal: '0.00',
        TotalDeuda: '0.00'
      }
    }
  },
  validations () {
    return {
      form: {
        name: { required },
        selected_insumo: { required }
      },
      formMe: {
        id_medicine: {
          required
        },
        cantidad: {
          required
        }
      },
      salaOperaciones: {
        minutos: {
          required
        },
        categoria: {
          required
        }
      }
    }
  },
  computed: {
    isCirugiaMayorOMedia () {
      return this.salaOperaciones.categoria === 'Cirugia media' || this.salaOperaciones.categoria === 'Cirugia mayor'
    },
    ...mapGetters({
      currentUser: 'currentUser'
    })
  },

  watch: {
    'salaOperaciones.categoria': 'calcularTotalAPagar',
    'salaOperaciones.oximetro': 'calcularTotalAPagar',
    'salaOperaciones.cauterio': 'calcularTotalAPagar',
    'salaOperaciones.horas': 'calcularTotalAPagar',
    'salaOperaciones.minutos': 'calcularTotalAPagar',
    selectedExamenAlmacenado (newValue) {
      if (newValue) {
        this.formExamen.por_pagar = newValue.precio_normal
        this.formExamen.id_examenes_almacenados = newValue.id
        this.formExamen.total = newValue.precio_normal
      }
    }
  },
  methods: {
    async cargarInsumos (tipo) {
      let endpoint = ''
      switch (tipo) {
        case '0': endpoint = '/medicamentos/list2'; break
        case '1': endpoint = '/quirurgico/list'; break
        case '2': endpoint = '/comun/list2'; break
      }

      try {
        const response = await axios.get(apiUrl + endpoint)
        this.insumosActuales = response.data.map(insumo => ({
          value: insumo.id,
          text: insumo.nombre,
          existencias_actuales: insumo.existencia_actual,
          precio_venta: insumo.precio_venta
        }))
      } catch (error) {
        console.error('Error cargando insumos:', error)
      }
    },
    onSelectChange () {
      this.tipoInsumoActual = this.form.selected_insumo
      this.cargarInsumos(this.form.selected_insumo)
      this.formMe.id_medicine = null // Resetear selección
    },
    onSeleccionarInsumo (id) {
      if (!id) return

      const insumo = this.insumosActuales.find(i => i.value === id)
      if (!insumo) return

      // Verificar si ya existe (incluyendo tipo)
      const yaExiste = this.consumosTemporales.some(item =>
        item.id === id && item.tipo === this.tipoInsumoActual
      )

      if (yaExiste) {
        this.alertErrorText = 'Este insumo ya fue agregado.'
        this.alertCountDownError = 5
        return
      }

      // Agregar con tipo incluido
      this.consumosTemporales.push({
        id,
        tipo: this.tipoInsumoActual,
        nombre: insumo.text,
        cantidad: 1,
        existencias: insumo.existencias_actuales,
        precio_venta: insumo.precio_venta
      })

      // Limpiar selección
      this.$nextTick(() => {
        this.formMe.id_medicine = null
      })
    },
    async onSave () {
      if (this.consumosTemporales.length === 0) {
        this.alertErrorText = 'Debe agregar al menos un insumo.'
        this.alertCountDownError = 5
        return
      }

      try {
        for (const consumo of this.consumosTemporales) {
          // Agregar validación de cantidad
          if (consumo.cantidad <= 0 || consumo.cantidad > consumo.existencias) {
            throw new Error(`Cantidad inválida para ${consumo.nombre}`)
          }

          if (consumo.tipo === '0') {
            await this.onSaveMedicamento(consumo)
          } else if (consumo.tipo === '1') {
            await this.onSaveQuirurgico(consumo)
          } else {
            await this.onSaveComunes(consumo)
          }
        }
        // Éxito
        this.alertVariant = 'success'
        this.alertText = 'Consumos registrados exitosamente!'
        this.showAlert()
        // Resetear y cerrar
        this.consumosTemporales = []
        this.$refs.vuetableConsumoInsumos.refresh()
        this.$refs.vuetableConsumoQuirurgicos.refresh()
        this.$refs.vuetableConsumoComunes.refresh()
        this.$refs['modal-1-movimiento'].hide()
      } catch (error) {
        this.alertVariant = 'danger'
        this.alertText = 'Error al guardar consumos'
        this.showAlert()
        console.error('Error:', error)
      }
    },
    openModal2 () {
      this.tipoInsumoActual = '0'
      this.cargarInsumos('0')
    },
    eliminarDeLista (id) {
      this.consumosTemporales = this.consumosTemporales.filter(item => item.id !== id)
    },
    mostrarModalConsumos (idCuenta) {
      if ([9, 10].includes(this.currentUser.user_type)) {
        this.showModal('modal-1-movimiento2')
      } else {
        this.showModal('modal-1-movimiento')
      }
      this.getConsumoMedicamentos(idCuenta)
      this.obtenerIdCuenta(idCuenta)
    },
    mostrarVerServicio (id) {
      if ([9, 10].includes(this.currentUser.user_type)) {
        this.$refs['modal-ver-servicio2'].show()
      } else {
        this.$refs['modal-ver-servicio'].show()
      }
      this.getDataConsumos(id)
      this.form.id_consumo = id
    },
    hasPermission (blockedRoles = []) {
      return !blockedRoles.includes(this.currentUser.user_type)
    },
    changeCheck () {
      if (!this.isCirugiaMayorOMedia) {
        this.salaOperaciones.oximetro = false
        this.salaOperaciones.cauterio = false
      } else if (this.isCirugiaMayorOMedia) {
        this.salaOperaciones.oximetro = true
        this.salaOperaciones.cauterio = true
      }
    },
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          this.form.selected_insumo = '0'
          this.existencias_selected_med = null
          this.formMe.precio_venta = 0
          this.formMe.existencias_actuales = null
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'traslado': {
          this.$v.$reset()
          this.$refs['modal-traslado'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          this.form.selected_insumo = '0'
          break
        }
        case 'add-receta': {
          this.$v.$reset()
          this.$refs['modal-add-receta'].hide()
          this.form.id = 0
          this.form.receta = null
          this.form.name = ''
          this.form.state = 1
          this.form.selected_insumo = '0'
          break
        }
        case 'add-evolucion': {
          this.$v.$reset()
          this.$refs['modal-add-evolucion'].hide()
          this.form.id = 0
          this.form.evolucion = null
          this.form.name = ''
          this.form.state = 1
          this.form.selected_insumo = '0'
          break
        }
        case 'add-orden': {
          this.$v.$reset()
          this.$refs['modal-add-orden'].hide()
          this.form.id = 0
          this.form.orden = null
          this.form.name = ''
          this.form.state = 1
          this.form.selected_insumo = '0'
          break
        }
        case 'ver-receta': {
          this.$v.$reset()
          this.$refs['modal-ver-receta'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          this.form.id_receta = null
          this.form.selected_insumo = '0'
          break
        }
        case 'add-servicio': {
          this.$v.$reset()
          this.$refs['modal-add-servicio'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          this.form.cantidad = null
          this.servicio = null
          this.form.servicio = null
          this.form.selected_insumo = '0'
          break
        }
        case 'ver-servicio': {
          this.$v.$reset()
          this.$refs['modal-ver-servicio'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          this.honorarios = []
          this.pagination.currentPage = 1
          this.pagination.total = 0
          this.honorario = {
            medico: null,
            descripcion: '',
            total: null
          }
          break
        }
        case 'ver-servicio2': {
          this.$v.$reset()
          this.$refs['modal-ver-servicio2'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          this.honorarios = []
          this.pagination.currentPage = 1
          this.pagination.total = 0
          this.honorario = {
            medico: null,
            descripcion: '',
            total: null
          }
          break
        }
        case 'ver-honorarios': {
          this.$v.$reset()
          this.$refs['modal-ver-honorarios'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'add-honorarios': {
          this.$v.$reset()
          this.$refs['modal-add-honorarios'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'sala-operaciones': {
          this.$v.$reset()
          this.$refs['modal-sala-operaciones'].hide()
          this.salaOperaciones.oximetro = false
          this.salaOperaciones.cauterio = false
          this.salaOperaciones.horas = null
          this.salaOperaciones.minutos = null
          this.salaOperaciones.categoria = null
          break
        }
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-movimiento'].hide()
          this.formMe.id_cuenta = 0
          this.formMe.cantidad = 0
          this.formMe.medicamento = null
          this.formMe.movimiento = 'SALIDAQ'
          this.form.selected_insumo = '0'
          this.existencias_selected_med = null
          break
        }
        case 'save2': {
          this.$v.$reset()
          this.$refs['modal-1-movimiento2'].hide()
          this.formMe.id_cuenta = 0
          this.formMe.cantidad = 0
          this.formMe.medicamento = null
          this.formMe.movimiento = 'SALIDAQ'
          this.form.selected_insumo = '0'
          this.existencias_selected_med = null
          break
        }
        case 'SaveQuirurgico': {
          this.$v.$reset()
          this.$refs['modal-1-movimiento'].hide()
          this.formQui.id_cuenta = 0
          this.formQui.cantidad = 0
          this.formQui.quirurgico = null
          this.formQui.movimiento = 'SALIDAQ'
          this.existencias_selected_med = null
          break
        }
        case 'SaveComunes': {
          this.$v.$reset()
          this.$refs['modal-1-movimiento'].hide()
          this.formCom.id_cuenta = 0
          this.formCom.cantidad = 0
          this.formCom.quirurgico = null
          this.formCom.movimiento = 'SALIDAQ'
          this.existencias_selected_med = null
          break
        }
        case 'ver-consumo': {
          this.$v.$reset()
          this.$refs['modal-ver-consumo'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          this.form.id_receta = null
          this.form.selected_insumo = '0'
          break
        }
        case 'modal_agregar': {
          this.$v.$reset()
          this.$refs['modal_agregar'].hide()
          this.formExamen.id = 0
          this.formExamen.nombre = ''
          this.formExamen.cui = 0
          this.formExamen.edad = 0
          this.formExamen.comision = ''
          this.formExamen.total = 0
          this.formExamen.correo = ''
          this.formExamen.whatsapp = ''
          this.formExamen.numero_muestra = ''
          this.formExamen.referido = ''
          this.formExamen.id_encargago = null
          this.formExamen.pagado = 0
          this.formExamen.por_pagar = 0
          this.formExamen.id_examenes_almacenados = null
          this.formExamen.id_expediente = 0
          this.formExamen.examenExterior = false
          this.apiBaseExamenes = null
          this.item_examenes = []
          this.examenes_almacenados = []
          break
        }
        case 'resultado': {
          this.$v.$reset()
          this.$refs['modal-add-resultados'].hide()
          this.formResultado.id = null
          this.formResultado.tipo = ''
          this.formResultado.resultado = null
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
    async calcularTotalAPagar () {
      try {
        let total = 0
        if (this.salaOperaciones.categoria) {
          const response = await axios.get(apiUrl + `/Categorias_Sala_Operaciones/getSearch?search=${this.salaOperaciones.categoria}`)
          total += parseFloat(response.data[0].precio)
          this.tarifaHoraExtra = parseFloat(response.data[0].cobro_extra)
        }

        if (this.salaOperaciones.oximetro) total += parseFloat(this.preciosServicios['Oximetro']) || 0
        if (this.salaOperaciones.cauterio) total += parseFloat(this.preciosServicios['Cauterio']) || 0

        const horas = parseFloat(this.salaOperaciones.horas) || 0
        const minutos = parseFloat(this.salaOperaciones.minutos) || 0
        const tiempoTotalMinutos = horas * 60 + minutos

        if (tiempoTotalMinutos > this.tiempoBase) {
          total += parseFloat(this.tarifaHoraExtra) * Math.ceil((tiempoTotalMinutos - this.tiempoBase) / 60)
        }
        this.TotalAPagar = parseFloat(total)
      } catch (error) {
        console.error('Error al calcular el total a pagar:', error)
        this.TotalAPagar = 0
      }
    },
    async cargarPreciosServicios () {
      try {
        const response = await axios.get(apiUrl + '/servicios/get')
        this.preciosServicios = response.data.reduce((acc, servicio) => {
          acc[servicio.descripcion] = servicio.precio
          return acc
        }, {})
      } catch (error) {
        console.error('Error al obtener precios de servicios:', error)
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
    async onSaveMedicamento  (consumo) {
      try {
        const payload = {
          id_cuenta: this.idCuentaSeleccionada,
          id_medicamento: consumo.id,
          cantidad: consumo.cantidad,
          precio_venta: consumo.precio_venta,
          movimiento: 'SALIDAQ',
          state: 1,
          existencias_actuales: consumo.existencias
        }
        const currentUser = this.currentUser
        await axios.post(apiUrl + '/detalle_consumo_medicamentos/create', {
          form: payload,
          currentUser
        })
      } catch (error) {
        console.error('Error en onSaveMedicamento:', error)
        throw error
      }
    },
    async onSaveQuirurgico (consumo) {
      try {
        const payload = {
          id_cuenta: this.idCuentaSeleccionada,
          id_medicamento: consumo.id,
          cantidad: consumo.cantidad,
          precio_venta: consumo.precio_venta,
          movimiento: 'SALIDAQ',
          state: 1,
          existencias_actuales: consumo.existencias
        }
        const currentUser = this.currentUser
        await axios.post(apiUrl + '/detalle_consumo_quirugicos/create', {
          form: payload,
          currentUser
        })
      } catch (error) {
        console.error('Error en onSaveQuirurgico:', error)
        throw error
      }
    },
    async onSaveComunes (consumo) {
      try {
        const payload = {
          id_cuenta: this.idCuentaSeleccionada,
          id_medicamento: consumo.id,
          cantidad: consumo.cantidad,
          precio_venta: consumo.precio_venta,
          movimiento: 'SALIDAQ',
          state: 1,
          existencias_actuales: consumo.existencias
        }
        const currentUser = this.currentUser
        await axios.post(apiUrl + '/detalle_consumo_comun/create', {
          form: payload,
          currentUser
        })
      } catch (error) {
        console.error('Error en onSaveComunes:', error)
        throw error
      }
    },
    traslado (id) {
      this.$refs['modal-traslado'].show()
      this.form.id = id
    },
    saveTraslado () {
      const me = this
      axios.put(apiUrl + '/expedientes/changeStatus', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha trasladado el expediente exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('traslado')
          me.form.id = 0
          me.form.selectedOption = 'hospi'
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('Error!', error)
        })
    },
    addReceta (id) {
      this.$refs['modal-add-receta'].show()
      this.form.id = id
    },
    addEvolucion (id) {
      this.$refs['modal-add-evolucion'].show()
      this.form.id = id
    },
    addOrdenes (id) {
      this.$refs['modal-add-orden'].show()
      this.form.id = id
    },
    saveReceta () {
      const me = this
      if (me.form.receta !== null) {
        axios.post(apiUrl + '/recetas/create', {
          form: me.form })
          .then((response) => {
            me.alertVariant = 'primary'
            me.showAlert()
            me.alertText = 'Se ha creado la receta exitosamente'
            me.$refs.vuetable.refresh()
            me.closeModal('add-receta')
            me.form.id = 0
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('Error!', error)
          })
      }
    },
    saveEvolucion () {
      const me = this
      if (me.form.evolucion !== null) {
        axios.post(apiUrl + '/evoluciones/create', {
          form: me.form })
          .then((response) => {
            me.alertVariant = 'primary'
            me.showAlert()
            me.alertText = 'Se ha creado la nota de evolución exitosamente'
            me.$refs.vuetable.refresh()
            me.closeModal('add-evolucion')
            me.form.id = 0
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('Error!', error)
          })
      }
    },
    saveOrden () {
      const me = this
      if (me.form.orden !== null) {
        axios.post(apiUrl + '/ordenes/create', {
          form: me.form })
          .then((response) => {
            me.alertVariant = 'primary'
            me.showAlert()
            me.alertText = 'Se ha creado la orden médica exitosamente'
            me.$refs.vuetable.refresh()
            me.closeModal('add-orden')
            me.form.id = 0
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('Error!', error)
          })
      }
    },
    verReceta (id) {
      this.$refs['modal-ver-receta'].show()
      this.getDataRecetas(id)
      this.form.id_receta = id
      this.tituloVer = 'Ver receta'
    },
    verEvolucion (id) {
      this.$refs['modal-ver-receta'].show()
      this.getDataEvoluciones(id)
      this.form.id_receta = id
      this.tituloVer = 'Ver evolución del paciente'
    },
    verOrden (id) {
      this.$refs['modal-ver-receta'].show()
      this.getDataOrdenes(id)
      this.form.id_receta = id
      this.tituloVer = 'Ver órdenes del paciente'
    },
    addServicio (id) {
      this.$refs['modal-add-servicio'].show()
      this.form.id = id
    },
    saveServicio () {
      const me = this
      if (me.servicio.id !== null && me.form.cantidad !== null) {
        me.form.servicio = me.servicio
        me.form.descripcion = 'Añadido en quirófano'
        axios.post(apiUrl + '/consumos/create', {
          form: me.form })
          .then((response) => {
            me.alertVariant = 'primary'
            me.showAlert()
            me.alertText = 'Se ha creado el consumo de un servicio exitosamente'
            me.$refs.vuetable.refresh()
            me.closeModal('add-servicio')
            me.form.id = 0
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('Error!', error)
          })
      } else {
        me.alertVariant = 'danger'
        me.showAlertError()
        me.alertErrorText = 'Por favor llene los campos solicitados'
      }
    },
    addhonorarios (id) {
      this.obtenerIdCuenta(id)// Obtener id_cuenta ANTES de mostrar el modal
      this.$refs['modal-add-honorarios'].show()
    },
    agregarHonorario () {
      try {
        axios.post(apiUrl + '/detalle_honorarios/created', {
          id_medico: this.honorario.medico.id,
          id_cuenta: this.idCuentaSeleccionada,
          descripcion: this.honorario.descripcion,
          total: this.honorario.total,
          lugar: 'Hospitalización'
        })
        this.$refs['modal-add-honorarios'].hide()
        this.honorario = {
          medico: null,
          descripcion: '',
          total: null
        }
      } catch (error) {
        console.error(error)
        this.alertErrorText = 'Error al agregar honorarios'
        this.showAlertError()
      }
    },
    addSalaOperaciones () {
      if (this.salaOperaciones.minutos > 0) {
        try {
          axios.post(apiUrl + '/salaOperaciones/created', {
            oximetro: this.salaOperaciones.oximetro,
            cauterio: this.salaOperaciones.cauterio,
            horas: this.salaOperaciones.horas,
            minutos: this.salaOperaciones.minutos,
            categoria: this.salaOperaciones.categoria,
            id_cuenta: this.idCuentaSeleccionada
          })
          this.$refs['modal-sala-operaciones'].hide()
          this.salaOperaciones = {
            oximetro: false,
            cauterio: false,
            horas: null,
            minutos: null,
            categoria: null
          }
        } catch (error) {
          console.error(error)
          this.alertErrorText = 'Error al agregar honorarios'
          this.showAlertError()
        }
      } else {
        this.alertErrorText = 'Debe ingresar el tiempo que se utilizo la sala.'
        this.showAlertError()
      }
    },
    showModal (modalId) {
      this.$bvModal.show(modalId)
    },
    verHonorarios (id) {
      this.obtenerIdCuenta(id)
      this.$refs['modal-ver-honorarios'].show()
    },
    /* Guardar */
    onUpdate () {
      const me = this
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
        item.fecha_ingreso_reciente = moment(item.fecha_ingreso_reciente).format('DD/MM/YYYY')
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
    makeQueryParamsReceta (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
    },
    onPaginationDataReceta (paginationData) {
      this.fromP = paginationData.from
      this.toP = paginationData.to
      this.totalP = paginationData.total
      this.lastPageP = paginationData.last_page
      this.items = paginationData.data
      this.$refs.paginationReceta.setPaginationData(paginationData)
    },
    onChangePageReceta (page) {
      this.$refs.vuetableRecetas.changePage(page)
    },
    getDataRecetas (id) {
      this.form.id = id
      this.apiBaseReceta = apiUrl + `/recetas/getId?id=${id}`
    },
    getDataEvoluciones (id) {
      this.form.id = id
      this.apiBaseReceta = apiUrl + `/evoluciones/getId?id=${id}`
    },
    getDataOrdenes (id) {
      this.form.id = id
      this.apiBaseReceta = apiUrl + `/ordenes/getId?id=${id}`
    },
    onSearchServicios (search, loading) {
      if (search.length) {
        this.searchingServicios(search, loading)
      }
    },
    searchingServicios (search, loading) {
      axios.get(apiUrl + '/servicios/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.servicios = response.data
      })
    },
    searchingMedicos (search, loading) {
      axios.get(apiUrl + '/medicos/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.medicos = response.data
      })
    },
    onSearchMedicos (search, loading) {
      if (search.length) {
        this.searchingMedicos(search, loading)
      }
    },
    makeQueryParamsConsumo (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
    },
    onPaginationDataConsumo (paginationData) {
      this.fromP = paginationData.from
      this.toP = paginationData.to
      this.totalP = paginationData.total
      this.lastPageP = paginationData.last_page
      this.items = paginationData.data
      this.$refs.paginationConsumo.setPaginationData(paginationData)
    },
    onChangePageConsumo (page) {
      this.$refs.vuetableConsumos.changePage(page)
      this.$refs.vuetableConsumoInsumos.changePage(page)
      this.$refs.vuetableConsumoQuirurgicos.changePage(page)
      this.$refs.vuetableConsumoComunes.changePage(page)
    },
    getDataConsumos (id) {
      this.form.id = id
      this.apiBaseConsumo = apiUrl + `/consumos/getId?id=${id}`
    },
    makeQueryParamsConsumoInsumo (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
    },
    onPaginationDataHonorarios (paginationData) {
      this.honorarios = paginationData.data.map(item => {
        item.total = parseFloat(item.total).toFixed(2)
        item.createdAt = moment(item.createdAt).format(`DD/MM/YYYY h:mm A`)
        return {
          id: item.id,
          medico: item.medico.nombre,
          descripcion: item.descripcion,
          total: item.total,
          createdAt: item.createdAt,
          updated_by: item.updated_by
        }
      })
      this.pagination.total = paginationData.total
      this.pagination.currentPage = Math.floor((paginationData.from - 1) / this.pagination.perPage) + 1
    },
    onChangePageHonorario (page) {
      this.pagination.currentPage = page
      this.getDataHonorarios(this.currentExpedienteId)
    },
    updateTotal (item) {
      const id = item.id
      const me = item
      axios.put(apiUrl + `/detalle_honorarios/${id}`, {
        form: me })
        .then((response) => {
          this.alertVariant = 'primary'
          this.showAlert()
          this.alertText = 'Se ha actualizado el expediente los honorarios del / la ' + me.medico + ' exitosamente'
        })
        .catch((error) => {
          this.alertVariant = 'danger'
          this.showAlertError()
          this.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('Error!', error)
        })
    },
    async obtenerIdCuenta (idExpediente) {
      try {
        const response = await axios.get(apiUrl + `/cuentas/getSearch?search=${idExpediente}`)
        if (response.data && response.data.id) {
          this.idCuentaSeleccionada = response.data.id
        } else {
          console.error('En AddHonorarios No se encontró ninguna cuenta para el expediente:', idExpediente)
          this.alertErrorText = 'No se encontró ninguna cuenta para este paciente'
          this.showAlertError()
        }
      } catch (error) {
        console.error('Error al obtener la cuenta:', error)
      }
    },
    async getDataHonorarios (idExpediente) {
      try {
        this.currentExpedienteId = idExpediente
        const response = await axios.get(apiUrl + `/cuentas/getSearch?search=${idExpediente}`)
        if (response.data && response.data.id) {
          const idcuenta = response.data.id
          const response2 = await axios.get(apiUrl + `/detalle_honorarios/getSearch?search=${idcuenta}&page=${this.pagination.currentPage}&limit=${this.pagination.perPage}`)
          this.onPaginationDataHonorarios(response2.data)
        } else {
          console.error('En Ver Honorarios No se encontró ninguna cuenta para el expediente:', idExpediente)
          this.alertErrorText = 'No se encontró ninguna cuenta para este paciente'
          this.showAlertError()
        }
      } catch (error) {
        console.error('Error al obtener los honorarios:', error)
      }
    },

    searchingMedicamentos (search, loading) {
      axios.get(apiUrl + '/medicamentos/list2')
        .then((response) => {
          this.medicamentos = response.data.map(medicamento => ({
            value: medicamento.id,
            text: medicamento.nombre,
            existencias_actuales: medicamento.existencia_actual,
            precio_venta: medicamento.precio_venta
          }))
        })
    },
    searchingQuirurgico (search, loading) {
      axios.get(apiUrl + '/quirurgico/list'
      ).then((response) => {
        this.medicamentos = response.data.map(medicamento => ({
          value: medicamento.id,
          text: medicamento.nombre,
          existencias_actuales: medicamento.existencia_actual,
          precio_venta: medicamento.precio_venta
        }))
      })
    },
    searchingComunes (search, loading) {
      axios.get(apiUrl + '/comun/list2'
      ).then((response) => {
        this.medicamentos = response.data.map(medicamento => ({
          value: medicamento.id,
          text: medicamento.nombre,
          existencias_actuales: medicamento.existencia_actual,
          precio_venta: medicamento.precio_venta
        }))
      })
    },
    onChangeMedicamento () {
      let medicine_ = this.medicamentos.find(med => med.value === this.formMe.id_medicine)
      this.max_cant = medicine_.existencias_actuales
      this.existencias_selected_med = medicine_.existencias_actuales + ' unidades en existencia.'
      this.formMe.precio_venta = medicine_.precio_venta
      this.formMe.existencias_actuales = medicine_.existencias_actuales
    },
    async getConsumoMedicamentos (id) {
      try {
        const response = await axios.get(apiUrl + `/cuentas/getSearch?search=${id}`)
        if (response.data && response.data.id) {
          this.idCuentaSeleccionada = response.data.id
          this.apiBaseConsumoMedicamento = apiUrl + `/detalle_consumo_medicamentos/list/${response.data.id}`
          this.apiBaseConsumoQuirurgico = apiUrl + `/detalle_consumo_quirugicos/list/${response.data.id}`
          this.apiBaseConsumoComun = apiUrl + `/detalle_consumo_comun/list/${response.data.id}`
        } else {
          console.error('No se encontró ninguna cuenta para el expediente:', id)
          this.alertErrorText = 'No se encontró ninguna cuenta para este paciente'
          this.showAlertError()
        }
      } catch (error) {
        console.error('Error al obtener la cuenta:', error)
      }
    },
    setData (data) {
      this.form.name = data.nombres
      this.form.nombres = data.nombres + ' ' + data.apellidos
      this.form.apellidos = data.apellidos
      this.form.state = data.estado
      this.form.id = data.id
    },
    getHabitaciones (num) {
      axios.get(apiUrl + '/habitaciones/get', {
        params: {
          tipo: num
        }
      }).then((response) => {
        this.habitaciones = response.data
      })
    },
    onState () {
      let me = this
      axios
        .put(apiUrl + '/expedientes/changeState', {
          id: this.form.id,
          estado: this.selectedTrasOption,
          estado_anterior: 5,
          motivo: this.motivoTrasladoEmergencia,
          user: me.currentUser.user
        })
        .then((response) => {
          me.alertVariant = 'info'
          me.showAlert()
          me.alertText = 'Se ha trasladado el paciente ' + me.form.nombres + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.$refs['modal-traslado'].hide()
          if (this.selectedTrasOption === 1 || this.selectedTrasOption === 4) {
            axios
              .put(apiUrl + '/habitaciones/inUse', {
                id: this.selectedHab.id,
                ocupante: this.form.id
              })
              .then((res) => {
                this.selectedHab = null
                this.getHabitaciones(0).then(me.$refs.selectHab.refresh())
              })
          }
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('There was an error!', error)
        })
    },
    onRelocation (action) {
      this.$v.$touch()
      if (this.selectedHab === null && (this.selectedTrasOption === 1 || this.selectedTrasOption === 4)) {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      } else {
        this.onState()
        this.$bvModal.hide('modal-traslado')
      }
    },

    /* AREA DE EXAMENES DE LABORATORIO */
    anular (id) {
      const me = this
      const ruta = apiUrl + `/Examenes_realizados/update?id=${id}`
      axios.put(ruta, {
        form: me.anularExamen
      })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha ANULADO el examen'
          me.ver_examen_realizado(id)
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    addResultado (id, nombreexamen, row) {
      this.$refs['modal-add-resultados'].show()
      this.formResultado.id = id
      this.getFieldsByExamenId(nombreexamen)
    },

    onValidateResultado (action) {
      const camposConErrores = this.camposResulado.filter(campo => campo.resultado === '' || campo.resultado == null)
      if (camposConErrores.length > 0) {
        this.alertErrorText = 'Revisa que todos los campos de resultado estén llenos.'
        this.showAlertError()
        return
      }
      this.onSaveResultados()
    },

    onSaveResultados () {
      const me = this
      const resultados = this.camposResulado.map(campo => ({
        id: me.formResultado.id,
        id_campo: campo.id,
        id_tipo: campo.id_tipo,
        resultado: campo.resultado
      }))

      axios.post(apiUrl + '/detalleExamenRealizado/create', { resultados })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se han ingresado los resultados de los exámenes exitosamente'
          me.$refs.vuetable2.refresh()
          me.$refs.vuetable3.refresh()
          me.closeModal('resultado')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error al guardar los resultados!', error)
        })
    },

    getFieldsByExamenId (examenId) {
      axios.get(apiUrl + '/campoLaboratorio/getByExamenId', {
        params: {
          id: examenId
        }
      })
        .then((response) => {
          this.camposResulado = response.data.map(item => ({
            id: item.id,
            nombre: item.nombre,
            unidades: item.unidades,
            resultado: '',
            id_tipo: item.id_examenes_almacenados
          }))
          const campos = response.data
          this.campos = campos
        })
        .catch((error) => {
          console.error('Error al obtener los campos del examen:', error)
        })
    },

    guardarExamenRealizado () {
      if (this.formExamen.total !== 0 && this.formExamen.numero_muestra !== 0 && this.formExamen.id_examenes_almacenados !== null) {
        axios.post(apiUrl + '/Examenes_realizados/create', {
          form: this.formExamen, user: me.currentUser.user })
          .then((response) => {
            this.alertVariant = 'success'
            this.showAlert()
            this.alertText = 'Se ingresado al pasciente ' + this.formExamen.nombre + ' exitosamente'
            this.closeModal('modal_agregar')
          })
          .catch((error) => {
            this.alertVariant = 'danger'
            this.showAlertError()
            this.alertErrorText = error.response.data.msg
            console.error('Error!', error)
          })
      } else {
        this.alertVariant = 'danger'
        this.showAlertError()
        this.alertErrorText = 'Por favor llene los campos solicitados'
      }
    },
    realizar_examen (id, nombre, apellido, cui, telefono) {
      this.formExamen.nombre = nombre + ' ' + apellido
      this.formExamen.cui = cui
      this.formExamen.whatsapp = telefono
      this.formExamen.id_expediente = id
    },
    ver_examen_realizado (cui) {
      axios.get(apiUrl + `/Examenes_realizados/list/cui?cui=${cui}`
      ).then((response) => {
        this.item_examenes = response.data
      })
    },
    onSearch_id_examenes_almacenados (search, loading) {
      if (search.length) {
        this.searching_id_examenes_almacenados(search, loading)
      }
    },
    searching_id_examenes_almacenados (search, loading) {
      axios.get(apiUrl + '/examenesAlmacenados/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.examenes_almacenados = response.data
      })
    },
    onSearchEncargado (search, loading) {
      if (search.length) {
        this.searchingEncargado(search, loading)
      }
    },
    searchingEncargado (search, loading) {
      axios.get(apiUrl + '/encargadoExamen/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.encargados = response.data
      })
    },

    /* GENERAR CUENTA PARCIAL PARA EL PACIENTE */
    generarReporteCuentaParcial (id, nombres, apellidos) {
      axios.get(apiUrl + `/consumos/sumario/${id}`)
        .then((response) => {
          this.dataPDFsumario = response.data
          this.nombrePaciente = nombres + ' ' + apellidos
          this.fechaIngreso = this.dataPDFsumario.fechaFormateada
          this.mostrarReporte(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    mostrarReporte (data) {
      let totalDeuda = 0

      const ConsumoTotal = data.consumos.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
      const ConsumoComunTotal = data.consumosComunes.reduce((acc, item) => acc + parseFloat(item.total), 0)
      const ConsumoMedicamentosTotal = data.consumosMedicamentos.reduce((acc, item) => acc + parseFloat(item.total), 0)
      const ConsumoQuirurgicosTotal = data.consumosQuirurgicos.reduce((acc, item) => acc + parseFloat(item.total), 0)
      const ExamenesTotal = data.examenes.reduce((acc, item) => acc + item.total, 0)
      const ServicioSalaOperacionesTotal = data.salaOperaciones.reduce((acc, item) => acc + parseFloat(item.total), 0)

      totalDeuda = parseFloat(ConsumoTotal) +
                  parseFloat(ConsumoComunTotal) +
                  parseFloat(ConsumoMedicamentosTotal) +
                  parseFloat(ConsumoQuirurgicosTotal) +
                  parseFloat(ExamenesTotal) +
                  parseFloat(ServicioSalaOperacionesTotal)

      this.reporte = {
        ConsumoTotal: this.formatearMonto(ConsumoTotal),
        ConsumoComunTotal: this.formatearMonto(ConsumoComunTotal),
        ConsumoMedicamentosTotal: this.formatearMonto(ConsumoMedicamentosTotal),
        ConsumoQuirurgicosTotal: this.formatearMonto(ConsumoQuirurgicosTotal),
        ExamenesTotal: this.formatearMonto(ExamenesTotal),
        ServicioSalaOperacionesTotal: this.formatearMonto(ServicioSalaOperacionesTotal),
        TotalDeuda: this.formatearMonto(totalDeuda)
      }

      this.$bvModal.show('reporteModal')
    },

    async generarPDF_CuentaParcial () {
      const FechaIngreso = this.fechaIngreso
      const data = this.dataPDFsumario
      const fechaActual = new Date()
      const fechaFormateada = fechaActual.toLocaleDateString('es-ES')
      const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true }
      const horaFormateada = fechaActual.toLocaleTimeString('es-ES', opcionesHora)

      let mensajeDias

      if (!FechaIngreso) {
        mensajeDias = 'NO ASIGNADA'
      } else {
        const fechaIngreso = new Date(FechaIngreso)
        const diferenciaMs = fechaActual - fechaIngreso
        const diasDiferencia = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24))
        mensajeDias = diasDiferencia
      }

      let hospitalizacion

      if (mensajeDias >= 2) {
        hospitalizacion = data.costo2 * mensajeDias
      } else {
        hospitalizacion = data.costo1
      }

      try {
        const ConsumoTotal = data.consumos.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
        const ConsumoComunTotal = data.consumosComunes.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoMedicamentosTotal = data.consumosMedicamentos.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoQuirurgicosTotal = data.consumosQuirurgicos.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ExamenesTotal = data.examenes.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ServicioSalaOperacionesTotal = data.salaOperaciones.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const TotalHonorarios = data.honorarios.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const medicosOrdenados = data.honorarios.sort((a, b) => b.total - a.total)

        const TotalGeneral =
          ConsumoTotal +
          ConsumoComunTotal +
          ConsumoMedicamentosTotal +
          ConsumoQuirurgicosTotal +
          ExamenesTotal +
          ServicioSalaOperacionesTotal +
          hospitalizacion

        const TotalGeneral2 =
          ConsumoTotal +
          ConsumoComunTotal +
          ConsumoMedicamentosTotal +
          ConsumoQuirurgicosTotal +
          ServicioSalaOperacionesTotal +
          hospitalizacion

        const TotalApagar = TotalGeneral2 + TotalHonorarios + ExamenesTotal
        const doc = new JsPDF()

        doc.setFontSize(10).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 10, { align: 'center' })

        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('CUENTA DE PACIENTE', 110, 14, { align: 'center' })

        doc.setFontSize(8).setFont(undefined, 'normal')
        doc.text('NOMBRE DEL PACIENTE:', 14, 20)
        doc.text(`${this.nombrePaciente}`, 50, 20)
        doc.text('_____________________________________________________________________________________________', 50, 21)

        doc.text('CUARTRO NO.:', 14, 27)
        doc.text(`${data.numerohabitacion}`, 40, 27)
        doc.text('__________', 35, 28)

        doc.text('TIPO DE SERVICIO:', 60, 27)
        doc.text('', 87, 27)
        doc.text('___________________________', 87, 28)

        doc.text('D/ESTANCIA: ', 130, 27)
        doc.text(`${mensajeDias}`, 170, 27)
        doc.text('_____________________________', 150, 28)

        doc.text('MD TRATANTE:', 14, 34)
        doc.text(`${data.nombremedico}`, 36, 34)
        doc.text('______________________________________________________________________________________________________', 36, 35)

        doc.autoTable({
          body: [
            ['HOSPITALIZACION', `Q${hospitalizacion.toFixed(2)}`],
            ['SALA DE OPERACIONES', `Q${ServicioSalaOperacionesTotal.toFixed(2)}`],
            ['CONSUMO MEDICAMENTOS', `Q${ConsumoMedicamentosTotal.toFixed(2)}`],
            ['MATERIAL MEDICO QUIRÚRGICO', `Q${ConsumoQuirurgicosTotal.toFixed(2)}`],
            ['ANESTESICOS', ''],
            ['MATERIAL COMÚN', `Q${ConsumoComunTotal.toFixed(2)}`],
            ['SERVICIOS', `Q${ConsumoTotal.toFixed(2)}`],
            ['RECUPERACION', ''],
            ['INTENSIVO', `Q 0.00`],
            ['EMERGENCIAS  Medico Interno', ''],
            ['OTROS', ''],
            ['TOTAL HOSPITALIZACION =', `Q${TotalGeneral2.toFixed(2)}`],
            ['TOTAL LAB. BIOMEDICO E.O. S.A. =', `Q${ExamenesTotal.toFixed(2)}`],
            ['TOTAL MENOS DESCUENTO =', `Q${TotalGeneral.toFixed(2)}`]
          ],
          startY: 41,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] },
          columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'left' }
          },
          didParseCell: function (data) {
            const rowIndex = data.row.index
            const colIndex = data.column.index
            if (rowIndex >= 11 && colIndex === 0) {
              data.cell.styles.halign = 'right'
            }
          }
        })

        const nextTableStartY = doc.lastAutoTable.finalY + 10

        doc.setFontSize(12).setFont(undefined, 'normal')
        doc.text(`FECHA ${fechaFormateada} ${horaFormateada}`, 14, nextTableStartY)

        doc.setFontSize(10).setFont(undefined, 'bold')
        doc.text('HONORARIOS MEDICOS Y OTROS SERVICIOS', 100, nextTableStartY + 15, { align: 'center' })

        const tableRows = medicosOrdenados.map((medico, index) => [
          index + 1,
          medico.medico.nombre,
          medico.descripcion,
          `Q${(Number(medico.total) || 0).toFixed(2)}`
        ])

        doc.autoTable({
          head: [['#', 'MEDICO', 'DESCRIPCION', 'VALOR']],
          body: tableRows,
          startY: nextTableStartY + 20,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        })

        const nextTableStartY2 = doc.lastAutoTable.finalY + 10

        doc.setFontSize(10).setFont(undefined, 'bold')
        doc.text('LIQUIDACION', 100, nextTableStartY2, { align: 'center' })

        doc.autoTable({
          body: [
            ['TOTAL HOSPITALIZACION', `Q${TotalGeneral2.toFixed(2)}`],
            ['TOTAL LAB. BIOMEDICO E.O. S.A.', `Q${ExamenesTotal.toFixed(2)}`],
            ['TOTAL HONORARIOS MEDICOS Y OTROS SERVICIOS', `Q${TotalHonorarios.toFixed(2)}`],
            ['TOTAL A PAGAR =', `Q${TotalApagar.toFixed(2)}`]
          ],
          startY: nextTableStartY2 + 5,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] },
          columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'left' }
          },
          didParseCell: function (data) {
            const rowIndex = data.row.index
            const colIndex = data.column.index
            if (rowIndex >= 3 && colIndex === 0) {
              data.cell.styles.halign = 'right'
            }
          }
        })

        const nextTableStartY3 = doc.lastAutoTable.finalY + 10

        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('_______________________________________', 110, nextTableStartY3, { align: 'center' })
        doc.text('Nombre y Firma del Cajero', 110, nextTableStartY3 + 5, { align: 'center' })

        doc.save(`cuenta_Parcial_${this.nombrePaciente}.PDF`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        this.$alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.', 'Error')
      }
    },
    formatearMonto (monto) {
      const montoNumerico = parseFloat(monto)
      if (isNaN(montoNumerico)) {
        return '0.00'
      }
      return montoNumerico.toFixed(2)
    },

    /* HISTORIAL DE LAS CUENTAS DEL EXPEDIENTE */
    generarHistorialCuentas (id) {
      axios.get(apiUrl + `/consumos/historial/${id}`)
        .then((response) => {
          const historial = response.data
          this.dataPDF_Historial = response.data
          this.mostrarHistorial(historial)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },

    mostrarHistorial (historial) {
      let totalDeuda = 0

      const ConsumoTotal = historial.Consumo.reduce((acc, item) => {
        return acc + (parseFloat(item.subtotal) || 0)
      }, 0)

      const ConsumoComunTotal = historial['Consumo Comun'].reduce((acc, item) => {
        return acc + (parseFloat(item.total) || 0)
      }, 0)

      const ConsumoMedicamentosTotal = historial['Consumo Medicamentos'].reduce((acc, item) => {
        return acc + (parseFloat(item.total) || 0)
      }, 0)

      const ConsumoQuirurgicosTotal = historial['Consumo Quirurgicos'].reduce((acc, item) => {
        return acc + (parseFloat(item.total) || 0)
      }, 0)

      const ExamenesTotal = historial.Examenes.reduce((acc, item) => {
        return acc + (parseFloat(item.total) || 0)
      }, 0)

      const ServicioSalaOperacionesTotal = historial.ServicioSalaOperaciones.reduce((acc, item) => {
        return acc + (parseFloat(item.total) || 0)
      }, 0)

      totalDeuda = parseFloat(ConsumoTotal) + parseFloat(ConsumoComunTotal) + parseFloat(ConsumoMedicamentosTotal) + parseFloat(ConsumoQuirurgicosTotal) + parseFloat(ExamenesTotal) + parseFloat(ServicioSalaOperacionesTotal)
      this.reporteHisotiral = {
        ConsumoTotal: this.formatearMonto(ConsumoTotal),
        ConsumoComunTotal: this.formatearMonto(ConsumoComunTotal),
        ConsumoMedicamentosTotal: this.formatearMonto(ConsumoMedicamentosTotal),
        ConsumoQuirurgicosTotal: this.formatearMonto(ConsumoQuirurgicosTotal),
        ExamenesTotal: this.formatearMonto(ExamenesTotal),
        ServicioSalaOperacionesTotal: this.formatearMonto(ServicioSalaOperacionesTotal),
        TotalDeuda: this.formatearMonto(totalDeuda)
      }

      this.$bvModal.show('HistorialCuenta')
    },

    generarPDF_Historial () {
      const doc = new JsPDF()
      let y = 20
      doc.setFontSize(18)
      doc.text('Reporte de Historial de Cuenta', 14, y)
      y += 10

      const agregarTabla = (title, data) => {
        doc.setFontSize(14)
        doc.text(title, 14, y)
        y += 10

        const headers = ['Descripción', 'Cantidad', 'Precio Unitario', 'Subtotal']
        doc.autoTable({
          startY: y,
          head: [headers],
          body: data.map(item => [
            item.descripcion,
            item.cantidad.toString(),
            item.precio_unitario.toString(),
            item.subtotal.toString()
          ]),
          theme: 'striped',
          margin: { top: 10 },
          styles: { halign: 'center', fontSize: 10 },
          headStyles: {
            fillColor: [229, 31, 45], // Color de fondo para el encabezado (Azul en este caso)
            textColor: [255, 255, 255] // Color de texto para el encabezado (Blanco en este caso)
          }
        })
        y = doc.lastAutoTable.finalY + 10
      }

      // Agregar tabla para cada categoría
      if (this.dataPDF_Historial.Consumo && this.dataPDF_Historial.Consumo.length > 0) {
        const consumosData = this.dataPDF_Historial.Consumo.map(consumo => ({
          descripcion: consumo.servicio.descripcion || '',
          cantidad: consumo.cantidad || 0,
          precio_unitario: consumo.servicio.precio || 0,
          subtotal: consumo.subtotal || 0
        }))
        agregarTabla('Consumo de Servicios', consumosData)
      }

      if (this.dataPDF_Historial['Consumo Comun'] && this.dataPDF_Historial['Consumo Comun'].length > 0) {
        const consumosComunesData = this.dataPDF_Historial['Consumo Comun'].map(consumo => ({
          descripcion: consumo.comune.nombre || '',
          cantidad: consumo.cantidad || 0,
          precio_unitario: consumo.precio_venta || 0,
          subtotal: consumo.total || 0
        }))
        agregarTabla('Consumo de Materiales Comunes', consumosComunesData)
      }

      if (this.dataPDF_Historial['Consumo Medicamentos'] && this.dataPDF_Historial['Consumo Medicamentos'].length > 0) {
        const consumosMedicamentosData = this.dataPDF_Historial['Consumo Medicamentos'].map(consumo => ({
          descripcion: consumo.medicamento.nombre || '',
          cantidad: consumo.cantidad || 0,
          precio_unitario: consumo.precio_venta || 0,
          subtotal: consumo.total || 0
        }))
        agregarTabla('Consumo de Medicamentos', consumosMedicamentosData)
      }

      if (this.dataPDF_Historial['Consumo Quirurgicos'] && this.dataPDF_Historial['Consumo Quirurgicos'].length > 0) {
        const consumosQuirurgicosData = this.dataPDF_Historial['Consumo Quirurgicos'].map(consumo => ({
          descripcion: consumo.quirurgico.nombre || '',
          cantidad: consumo.cantidad || 0,
          precio_unitario: consumo.precio_venta || 0,
          subtotal: consumo.total || 0
        }))
        agregarTabla('Consumo de Material Quirúrgico', consumosQuirurgicosData)
      }

      if (this.dataPDF_Historial.Examenes && this.dataPDF_Historial.Examenes.length > 0) {
        const examenesData = this.dataPDF_Historial.Examenes.map(examen => ({
          descripcion: examen.examenes_almacenado.nombre || '',
          cantidad: 1,
          precio_unitario: examen.total || 0,
          subtotal: examen.total || 0
        }))
        agregarTabla('Exámenes Realizados', examenesData)
      }

      if (this.dataPDF_Historial.ServicioSalaOperaciones && this.dataPDF_Historial.ServicioSalaOperaciones.length > 0) {
        const serviciosData = this.dataPDF_Historial.ServicioSalaOperaciones.map(servicio => ({
          descripcion: servicio.descripcion || '',
          cantidad: 1,
          precio_unitario: servicio.total || 0,
          subtotal: servicio.total || 0
        }))
        agregarTabla('Servicios en Sala de Operaciones', serviciosData)
      }

      // Mostrar el total de deuda
      // const totalDeuda = this.reporte.TotalDeuda || 0
      // doc.setFontSize(16)
      // doc.text(`Total Deuda: Q${totalDeuda}`, 14, y)
      y += 10

      // Guardar el PDF
      doc.save('reporte_historial.pdf')
    }
  }
}
</script>
<style>
.center-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Adjust this if needed */
  text-align: center;
}
.custom-editor {
  height: 350px; /* Adjust the height as needed */
}
.custom-editor .ql-editor {
  color: #333; /* Adjust the color value to make the text darker */
}
.mt-negativo {
  margin-top: -3%;
}
.mt-negativo-r1{
  margin-top: -2%;
}
</style>
