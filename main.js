var tabpanel;

var Workaholic = {};

/* ===== JAVASCRIPT EXTENSIONS */


String.prototype.ljust = function( width, padding ) {
  padding = padding || " ";
  padding = padding.substr( 0, 1 );
  if( this.length < width )
    return this + padding.repeat( width - this.length );
  else
    return this;
};


/* ===== EXT EXTENSIONS ====== */

Workaholic.DateTimePicker = Ext.extend(Ext.Picker, {

  /* 30 days ago */
  startDate: new Date() - (1000 * 60 * 60 * 24 * 30),

  /* 30 days from now */
  endDate: (new Date() * 1) + (1000 * 60 * 60 * 24 * 30),

  slotOrder: ['date', 'hours', 'minutes'],


  initComponent: function() {

    var dates = [];
    var hours = [];
    var minutes = [];
    var i;
    this.slots = [];

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    var amount_of_days = Math.round(
      (this.endDate - this.startDate) / (1000 * 60 * 60 * 24));

    for(i=0; i<amount_of_days; i++) {
      var date = new Date(this.startDate + (1000 * 60 * 60 * 24 * i));
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      var is_today = date * 1 === today * 1;

      dates.push({
        text: is_today ? 'Today' : date.format('D. d. M'),
        value: date * 1
      });
    }

    this.slots.push({name: 'date',
                     align: 'right',
                     data: dates,
                     title: false,
                     flex: 5});

    for(i=0; i<60; i++) {
      if(i<24) {
        hours.push({text: String(i),
                    value: i});
      }
      minutes.push({text: i < 10 ? '0'.concat(i) : String(i),
                    value: i});
    }

    this.slots.push({name: 'hours',
                     align: 'left',
                     data: hours,
                     title: false,
                     flex: 2});

    this.slots.push({name: 'minutes',
                     align: 'center',
                     data: minutes,
                     title: false,
                     flex: 2});

    return Workaholic.DateTimePicker.superclass.initComponent.call(this);
  },

  setValue: function(value, animated) {
    if (!Ext.isDate(value) && !Ext.isObject(value)) {
      value = null;
    }

    if (Ext.isDate(value)) {
      var zeroDate = new Date(value);
      zeroDate.setHours(0);
      zeroDate.setMinutes(0);
      zeroDate.setSeconds(0);
      zeroDate.setMilliseconds(0);

      this.value = {date: zeroDate * 1,
                    hours: value.getHours(),
                    minutes: value.getMinutes()};

    } else {
      this.value = value;
    }

    return Workaholic.DateTimePicker.superclass.setValue.call(
      this, this.value, animated);
  },

  getValue: function() {
    var value = Workaholic.DateTimePicker.superclass.getValue.call(this);
    var date = new Date(value['date']);
    date.setHours(value['hours']);
    date.setMinutes(value['minutes']);
    return date;
  }
});
Ext.reg('timepicker', Workaholic.DateTimePicker);


Workaholic.DateTimePickerField = Ext.extend(Ext.form.DatePicker, {

  setValue: function(value) {
    if(value && Ext.isNumber(value)) {
      value = new Date(value);
    }
    return Workaholic.DateTimePickerField.superclass.setValue.call(this, value);
  },

  getValue: function(format) {
    var value = this.value || null;

    if(!format) {
      return value;
    }

    if(Ext.isNumber(value)) {
      value = new Date(value);
    }

    if(Ext.isDate(value)) {
      return value.format('D. d. M H:i');
    } else {
      return value;
    }
  },

  onPickerChange: function(picker, value) {
    this.setValue(value);
    this.fireEvent('select', this, this.getValue());
  },

  getDatePicker: function() {
    if (!this.datePicker) {
      if (this.picker instanceof Workaholic.DateTimePicker) {
        this.datePicker = this.picker;
      } else {
        this.datePicker = new Workaholic.DateTimePicker(
          Ext.apply(this.picker || {}));
      }

      this.datePicker.on({
        scope : this,
        change: this.onPickerChange,
        hide  : this.onPickerHide
      });
    }

    this.datePicker.setValue(this.value ? new Date(this.value) : new Date());

    return this.datePicker;
  }
});
Ext.reg('timepickerfield', Workaholic.DateTimePickerField);


/* ===== DATABASE ====== */

Ext.regModel('Clocktime', {
  fields: [
    'id',
    /* timestamp of clocking in */
    {name: 'clockin',
     type: 'int'},
    /* timestamp of clocking out */
    {name: 'clockout',
     type: 'int',
     defaultValue: 0},
    /* true if clockout is set */
    {name: 'closed',
     type: 'boolean',
     defaultValue: false}
  ],

  proxy: {
    type: 'localstorage',
    id  : 'workaholic-clocktime'
  }

});

Ext.regModel('Settings', {
  fields: [
    'id',
    {name: 'key',
     type: 'string'},

    {name: 'value',
     type: 'string'}
  ],

  proxy: {
    type: 'localstorage',
    id  : 'workaholic-settings'
  }
});

Ext.regModel('Tasks', {
  fields: [
    'id',

    {name: 'title',
     type: 'string'},

    {name: 'description',
     type: 'string'}
  ],

  proxy: {
    type: 'localstorage',
    id: 'workaholic-tasks'
  }
});

Ext.regModel(
  'TaskInvestment', {
    fields: [
      'id',

      {name: 'task_id',
       type: 'int'},

      {name: 'starttime',
       type: 'int'},

      {name: 'endtime',
       type: 'int',
       defaultValue: 0},

      {name: 'comment',
       type: 'string'}
    ],

    associations: {
      type: 'belongsTo',
      model: 'Tasks',
      primaryKey: 'id',
      foreignKey: 'task_id'
    },

    proxy: {
      type: 'localstorage',
      id: 'workaholic-task-investement'
    }
  });


Ext.setup({
  icon: 'icon.png',
  // tabletStartupScreen: 'tablet_startup.png',
  // phoneStartupScreen: 'phone_startup.png',
  // glossOnIcon: false,

  onReady: function() {

    var get_tasks_store = function() {
      /* returns a SINGLETON tasks store */
      if(typeof get_tasks_store._store == 'undefined') {
        get_tasks_store._store = new Ext.data.Store(
          {model: 'Tasks', sorters: 'title'});
        get_tasks_store._store.load();
      }
      return get_tasks_store._store;
    };

    var get_task_investment_store = function() {
      /* returns a SINGLETON task investment store */
      if(typeof get_task_investment_store._store == 'undefined') {
        get_task_investment_store._store = new Ext.data.Store(
          {model: 'TaskInvestment', sorters: 'startime'});
        get_task_investment_store._store.load();
      }
      return get_task_investment_store._store;
    };

    /* ============== CLOCKING ============ */

    var clock_in = function() {
      Ext.getCmp('clock-in-button').disable();
      Ext.getCmp('clock-out-button').enable();
      Ext.ModelMgr.create({
        clockin: (new Date()).getTime()
      }, 'Clocktime').save();
    };

    var clock_out = function() {
      Ext.getCmp('clock-in-button').enable();
      Ext.getCmp('clock-out-button').disable();

      var store = new Ext.data.Store({model: 'Clocktime'});
      store.load();
      store.filter('closed', false);
      var rec = store.first();
      rec.set('clockout', (new Date()).getTime());
      rec.set('closed', true);
      rec.save();
    };

    var update_clock_summary = function() {
      var panel = Ext.getCmp('clock-summary');

      /* calculate the amount of time worked today */
      var store = new Ext.data.Store({model: 'Clocktime'});
      store.load();

      var start_today = new Date();
      start_today.setHours(0);
      start_today.setMinutes(0);
      start_today.setSeconds(0);

      var start_week = new Date();
      start_week.setHours(0);
      start_week.setMinutes(0);
      start_week.setSeconds(0);
      // set date to the day where "day" is 0 (=sunday)
      start_week.setTime(start_week.getTime() - (start_week.getDay() *
                                                 60 * 60 * 24 * 1000));

      var today = 0;
      var week = 0;
      store.each(function(record) {
        var clockin = record.get('clockin');
        var clockout = record.get('clockout');
        if(!clockout) {
          clockout = (new Date()).getTime();
        }
        if(clockin > start_today) {
          today += (clockout - clockin);
        }
        if(clockin > start_week) {
          week += (clockout - clockin);
        }
      });

      var ftime = function(milliseconds) {
        /* returns amount of hours */
        return Math.round((milliseconds / 1000 / 60 / 60) * 100) / 100;
      };

      panel.update('<br />' +
                   '<table>' +
                   '<tr><th>Worked today:</th><td>' + ftime(today) + 'h</td></tr>' +
                   '<tr><th>Worked this week:</th><td>' + ftime(week) + 'h</td></tr>' +
                   '</table>');
    };
    setInterval(update_clock_summary, 30000);

    var clocktime_details_panel = new Ext.Panel({

      listeners: {
        beforeactivate: function(button) {
          var form = Ext.getCmp('clocktime_details_panel-form');
          form.record = null;
          /* reset fields */
          form.getFieldsAsArray().forEach(function(field) {
            field.setValue();
          });
          form.reset();

          if(clocktime_details_panel._record !== null) {
            form.loadRecord(clocktime_details_panel._record);

            Ext.getCmp('clocktime_details_panel-delete_item').show();

          } else {
            Ext.getCmp('clocktime_details_panel-delete_item').hide();
          }
        }
      },

      dockedItems: [{xtype: 'toolbar',
                     dock: 'top',

                     items: [
                       {xtype: 'button',
                        ui: 'back',
                        text: 'Cancel',
                        handler: function(button) {
                          main_panel.setActiveItem(clock_listing_panel, 'flip');
                        }},

                       {xtype: 'spacer'},

                       {xtype: 'button',
                        text: 'Save',

                        handler: function(button) {
                          var form = Ext.getCmp('clocktime_details_panel-form');
                          var values = form.getValues();

                          if(values.clockin > values.clockout) {
                            alert('Start time must be before end time.');
                            return;
                          }

                          if(clocktime_details_panel._record !== null) {
                            /* edit mode */
                            var record = form.getRecord();
                            record.set('clockin', values.clockin.getTime());
                            record.set('clockout', values.clockout.getTime());
                            record.save();

                          } else {
                            /* create mode */
                            Ext.ModelMgr.create({clockin: values.clockin.getTime(),
                                                clockout: values.clockout.getTime(),
                                                closed: true}, 'Clocktime').save();
                          }

                          /* reload the tasks store */
                          Ext.getCmp('clock_listing_panel-list').getStore().load();

                          /* close dialog */
                          main_panel.setActiveItem(clock_listing_panel, 'flip');

                        }}

                     ]
                    }],

      items: [{xtype: 'form',
               id: 'clocktime_details_panel-form',
               scroll: 'vertical',

               items: [
                 {xtype: 'fieldset',
                  defaults: {
                    labelWidth: '35%'
                  },

                  items: [

                    {xtype: 'timepickerfield',
                     name: 'clockin',
                     label: 'Start'},

                    {xtype: 'timepickerfield',
                     name: 'clockout',
                     label: 'End'}

                  ]
                 },

                 {xtype: 'button',
                  id: 'clocktime_details_panel-delete_item',
                  ui: 'decline',
                  text: 'Delete',

                  handler: function(button) {
                    var form = Ext.getCmp('clocktime_details_panel-form');
                    var store = Ext.getCmp('clock_listing_panel-list').getStore();
                    store.remove(form.getRecord());
                    store.sync();

                    /* close dialog */
                    main_panel.setActiveItem(clock_listing_panel, 'flip');
                  }}

               ]
              }]

    });

    var clock_listing_panel = new Ext.Panel({
      dockedItems: [
        {xtype: 'toolbar',
         dock: 'top',

         items: [

           {xtype: 'button',
            ui: 'back',
            text: 'Back',

            handler: function() {
              main_panel.setActiveItem(tabpanel, 'flip');
            }},

           {xtype: 'spacer'},

           {xtype: 'segmentedbutton',
            allowMultiple: true,
            scope: this,

            listeners: {
              toggle: function(container, button, pressed) {
                var store = Ext.getCmp('clock_listing_panel-list').getStore();
                store._show_all = pressed;
                store.load();
              }
            },

            items: [
              {text: 'Show all'}
            ]},


           {xtype: 'spacer'},

           {xtype: 'button',
            iconMask: true,
            ui: 'plain',
            iconCls: 'add',

            handler: function(button) {
              clocktime_details_panel._record = null;
              main_panel.setActiveItem(clocktime_details_panel, 'flip');
            }
           }

         ]}

      ],

      listeners: {
        beforeactivate: function(panel) {
          var store = Ext.getCmp('clock_listing_panel-list').getStore();

          /* create a grouped store - if not created already */
          if(typeof store === 'undefined') {
            store = new Ext.data.Store({
              model: 'Clocktime',
              sorters: [
                {property: 'clockin',
                 direction: 'DESC'}
              ],

              getGroupString: function(record) {
                var start = new Date(record.get('clockin'));

                var today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);

                var yesterday = new Date();
                yesterday.setHours(0);
                yesterday.setMinutes(0);
                yesterday.setSeconds(0);
                // set date to the day where "day" is 0 (=sunday)
                yesterday.setTime(yesterday.getTime() -
                                  (yesterday.getDay() * 60 * 60 * 24 * 1000));

                if(start > today) {
                  return 'Today - ' + today.format('D, d. M');
                }

                else if(start > yesterday) {
                  return 'Yesterday - ' + yesterday.format('D, d. M');
                }

                else {
                  return start.format('D, d. M');
                }
              },

              filters: [
                function(record) {
                  if(record.get('clockout') === 0) {
                    return false;
                  }

                  var show_all = false;

                  var store = Ext.getCmp('clock_listing_panel-list').getStore();
                  if(typeof store != 'undefined') {
                    show_all = store._show_all;
                  }

                  if(show_all) {
                    return true;

                  } else {
                    var week_start = new Date();
                    week_start.setHours(0);
                    week_start.setMinutes(0);
                    week_start.setSeconds(0);
                    // set date to the day where "day" is 0 (=sunday)
                    week_start.setTime(week_start.getTime() - (week_start.getDay() *
                                                               60 * 60 * 24 * 1000));

                    return new Date(record.get('clockin')) > week_start;
                  }
                }
              ]
            });

            /* bind the store - need to load it first */
            store.load();
            Ext.getCmp('clock_listing_panel-list').bindStore(store);
          }

          else {
            /* refresh the store */
            store.load();
          }
        }
      },

      items: [

        {xtype: 'list',
         id: 'clock_listing_panel-list',
         layout: 'fit',
         grouped: true,
         disableSelection: true,

         store: null,
         itemTpl: new Ext.XTemplate(
           '{[this.render(values)]}',
           {compiled: true,

            render: function(values) {
              var start = new Date(values.clockin).format('H:i');
              var end = new Date(values.clockout).format('H:i');
              var hours = Math.round((values.clockout - values.clockin) /
                                     1000 / 60 / 60 * 100) / 100;
              return '<b>' + hours + 'h</b> (' + start + ' - ' + end + 'h)';
            }
           }
         ),

         listeners: {

           itemtap: function(list, index, node, event) {
             clocktime_details_panel._record = list.getRecord(node);
             main_panel.setActiveItem(clocktime_details_panel, 'flip');
           }

         }

        }

      ]
    });

    var clock_panel = new Ext.Panel({

      dockedItems: [
        {
          dock : 'top',
          xtype: 'toolbar',
          title: 'Workaholic',

          items: [
            {xtype: 'button',
             iconMask: true,
             iconCls: 'refresh',
             ui: 'plain',
             handler: function() {
               window.location.reload();
             }},

            {xtype: 'spacer'},

            {xtype: 'button',
             // text: 'Details',
             // ui: 'forward',
             iconMask: true,
             ui: 'plain',
             iconCls: 'list',
             handler: function() {
               main_panel.setActiveItem(clock_listing_panel, 'flip');
             }}

          ]
        }
      ],

      layout: 'vbox',

      items: [
        {
          xtype: 'button',
          id: 'clock-in-button',
          componentCls: 'clock-button',
          text: 'Clock in',
          disabled: true,
          handler: clock_in
        },

        {
          xtype: 'button',
          id: 'clock-out-button',
          componentCls: 'clock-button',
          text: 'Clock out',
          disabled: true,
          handler: clock_out
        },

        {
          xtype: 'panel',
          id: 'clock-summary'
        }
      ],

      listeners: {
        beforerender: function(panel) {
          var store = new Ext.data.Store({model: 'Clocktime'});
          store.load();
          store.filter('closed', false);
          if(store.first()) {
            Ext.getCmp('clock-in-button').disable();
            Ext.getCmp('clock-out-button').enable();
          } else {
            Ext.getCmp('clock-in-button').enable();
            Ext.getCmp('clock-out-button').disable();
          }
          update_clock_summary();
        }
      }
    });



    /* ============== TASKS ============ */

    var task_update_stop_button = function() {
      if(get_task_investment_store().find('endtime', 0) === -1) {
        Ext.getCmp('tasks_panel-stop_button').hide();
      } else {
        Ext.getCmp('tasks_panel-stop_button').show();
      }
    };

    var task_details_panel = new Ext.Panel({

      dockedItems: [
        {
          dock : 'top',
          xtype: 'toolbar',
          title: 'Add Task',

          items: [
            {xtype: 'button',
             ui: 'back',
             text: 'Cancel',
             handler: function() {
               main_panel.setActiveItem(tabpanel, 'flip');
             }},
            {xtype: 'spacer'},

            {xtype: 'button',
             text: 'Save',

             handler: function(button) {
               var form = Ext.getCmp('task_details_panel-task_form');
               var values = form.getValues();

               if(values.title.length===0) {
                 alert('Please enter a title.');
                 return;
               }

               if(task_details_panel._record !== null) {
                 /* edit mode */
                 var record = form.getRecord();
                 form.updateRecord(record);
                 record.save();

               } else {
                 /* create mode */
                 Ext.ModelMgr.create(values, 'Tasks').save();
               }

               /* reload the tasks store */
               get_tasks_store().load();

               /* close dialog */
               main_panel.setActiveItem(tabpanel, 'flip');
             }}
          ]
        }
      ],

      items: [
        {xtype: 'form',
         id: 'task_details_panel-task_form',
         scroll: 'vertical',

         items: [
           {xtype: 'fieldset',
            title: 'Task data',
            defaults: {
              labelWidth: '35%'
            },

            items: [
              {xtype: 'textfield',
               name: 'title',
               label: 'Title'
              },

              {xtype: 'textareafield',
               name: 'description',
               label: 'Description'}

            ]},

           {xtype: 'button',
            id: 'task_details_panel-delete_task',
            ui: 'decline',
            text: 'Delete Task',

            handler: function(){
              if(!this.actions) {
                this.actions = new Ext.ActionSheet({
                  items: [

                    {text: 'Delete',
                     ui: 'decline',
                     scope: this,
                     handler: function(button) {
                       /* remove record */
                       var form = Ext.getCmp('task_details_panel-task_form');
                       var store = get_tasks_store();
                       store.remove(form.getRecord());
                       store.sync();

                       /* close dialog */
                       main_panel.setActiveItem(tabpanel, 'flip');
                       this.actions.hide();
                     }},

                    {text: 'Cancel',
                     scope: this,
                     handler: function(button) {
                       this.actions.hide();
                     }}

                  ]
                });
              }
              this.actions.show();

            }}

         ]}
      ],

      listeners: {
        beforeactivate: function(button) {
          var form = Ext.getCmp('task_details_panel-task_form');
          form.record = null;
          /* reset fields */
          form.getFieldsAsArray().forEach(function(field) {
            field.setValue();
          });
          form.reset();

          if(task_details_panel._record !== null) {
            form.loadRecord(task_details_panel._record);
            Ext.getCmp('task_details_panel-delete_task').show();

          } else {
            Ext.getCmp('task_details_panel-delete_task').hide();
          }

        }
      }
    });

    var tasks_panel = {
      xtype: 'panel',

      dockedItems: [
        {
          dock : 'top',
          xtype: 'toolbar',
          title: 'Tasks',
          items: [
            {xtype: 'button',
             ui: 'decline',
             text: 'Stop',
             id: 'tasks_panel-stop_button',

             handler: function(button) {
               var store = get_task_investment_store();
               /* stop current task investment */
               var record = store.findRecord('endtime', 0);
               record.set('endtime', (new Date()).getTime());
               record.save();

               store.load();
               task_update_stop_button();
             }},

            {xtype: 'spacer'},

            {xtype: 'button',
             iconMask: true,
             ui: 'plain',
             iconCls: 'add',
             handler: function() {
               task_details_panel._record = null;
               main_panel.setActiveItem(task_details_panel, 'flip');
             }}
          ]
        }
      ],

      items: [
        {
          layout: 'fit',
          xtype: 'list',
          singleSelect: true,
          emptyText: 'No tasks created yet.',

          store: get_tasks_store(),
          itemTpl: '{title}',
          disableSelection: true,

          // onItemDisclosure: function(record, node, index, event) {
          // },

          listeners: {

            itemswipe: function(list, index, node, event) {
              task_details_panel._record = list.getRecord(node);
              main_panel.setActiveItem(task_details_panel, 'flip');
            },

            itemtap: function(list, index, node, event) {
              if(event.target.getAttribute(
                'class').indexOf('disclosure') > -1) {
                /* prevent disclosure capture */
                return;
              }

              this.task_record = list.getRecord(node);

              if(get_task_investment_store().find('endtime', 0) === -1) {
                /* currently not working on any task */
                if(!this.not_working_actions) {
                  this.not_working_actions = new Ext.ActionSheet({items: [

                    {text: 'Start working on this task',
                     ui: 'confirm',
                     scope: this,

                     handler: function(button){
                       Ext.ModelMgr.create({
                         starttime: (new Date()).getTime(),
                         task_id: this.task_record.getId()
                       }, 'TaskInvestment').save();
                       get_task_investment_store().load();
                       this.not_working_actions.hide();
                       task_update_stop_button();
                     }},

                    {text: 'Cancel',
                     scope: this,
                     handler: function(button){
                       this.not_working_actions.hide();
                     }}

                  ]});
                }
                this.not_working_actions.show();
              }

              else {
                /* currently work on a task */
                if(!this.working_actions) {
                  this.working_actions = new Ext.ActionSheet({items: [

                    {text: 'Stop and start on this task ',
                     ui: 'confirm',
                     scope: this,
                     handler: function(button) {
                       var store = get_task_investment_store();
                       /* stop current task investment */
                       var record = store.findRecord('endtime', 0);
                       record.set('endtime', (new Date()).getTime());
                       record.save();

                       /* start new task investment */
                       Ext.ModelMgr.create({
                         starttime: (new Date()).getTime(),
                         task_id: this.task_record.getId()
                       }, 'TaskInvestment').save();

                       store.load();
                       task_update_stop_button();
                       this.working_actions.hide();
                     }},

                    {text: 'Switch task backdated',
                     ui: 'decline',
                     scope: this,
                     handler: function(button) {
                       var store = get_task_investment_store();
                       /* swich task of already running investment */
                       var record = store.findRecord('endtime', 0);
                       record.set('task_id', this.task_record.getId());
                       record.save();

                       store.load();
                       task_update_stop_button();
                       this.working_actions.hide();
                     }},

                    {text: 'Cancel',
                     scope: this,
                     handler: function(button) {
                       this.working_actions.hide();
                     }}

                  ]});
                }
                this.working_actions.show();
              }
            }

          }
        }
      ],

      listeners: {
        beforerender: function(panel) {
          task_update_stop_button();
        }
      }

    };



    /* ============== STATISTICS ============ */

    var stats_panel = {

      dockedItems: [
        {
          dock : 'top',
          xtype: 'toolbar',
          title: 'Statistics'
        }
      ],

      items: [
        {
          xtype: 'panel',
          html: '<p><br /><center>Not yet implemented</center></p>'
        }
      ]

    };



    /* ============== SETTINGS ============ */

    var set_setting = function(key, value) {
      var store = new Ext.data.Store({model: 'Settings'});
      store.load();
      store.filter('key', key);
      var rec = store.first();
      if(rec) {
        rec.set('value', value);
        rec.save();
      } else {
        Ext.ModelMgr.create({key: key, value: value},
                            'Settings').save();
      }
    };

    var get_setting = function(key, defaultValue) {
      var store = new Ext.data.Store({model: 'Settings'});
      store.load();
      store.filter('key', key);
      var rec = store.first();
      if(rec) {
        return rec.get('value');
      } else {
        return defaultValue;
      }
    };

    var get_working_time = function() {
      return get_setting('working-time', 40);
    };

    var settings_panel = {

      dockedItems: [
        {
          dock : 'top',
          xtype: 'toolbar',
          title: 'Settings',
          items: [
            {xtype: 'spacer'},

            {xtype: 'button',
             text: 'Save',
             handler: function() {
               set_setting(
                 'working-time',
                 Ext.getCmp('settings-field-working-time').getValue());

               tabpanel.setActiveItem(tabpanel.items.get(0),
                                      {type: 'slide', direction: 'right'});
             }}

          ]
        }
      ],

      items: [
        {
          title: 'Basic',
          xtype: 'form',
          id: 'basicform',
          scroll: 'vertical',
          items: [

            {
              xtype: 'fieldset',
              title: 'Clock settings',
              instructions: 'Enter the amount of hours you should work '+
                'per week',
              defaults: {
                labelWidth: '50%'
              },

              items: [
                {
                  xtype: 'numberfield',
                  name: 'working_time',
                  label: 'Working Time',
                  id: 'settings-field-working-time'
                }
              ]
            },

            {xtype: 'button',
             ui: 'decline',
             text: 'Reset Application',
             handler: function(button) {
               if (!this.actions) {
                 this.actions = new Ext.ActionSheet({
                   items: [{
                     text: 'Delete everything!',
                     ui: 'decline',
                     scope: this,
                     handler: function(button) {
                       window.localStorage.clear();
                       this.actions.hide();
                     }
                   },{
                     text: 'Cancel',
                     scope: this,
                     handler: function(button) {
                       this.actions.hide();
                     }
                   }]
                 });
               }
               this.actions.show();
             }}

          ]
        }

      ],

      listeners: {
        beforerender: function(panel) {
          Ext.getCmp('settings-field-working-time').value = get_working_time();
        }
      }
    };




    /* ============== MAIN PANEL ============ */
    tabpanel = new Ext.TabPanel({
      tabBar: {
        dock: 'bottom',
        layout: {
          pack: 'center'
        }
      },

      ui: 'light',
      cardSwitchAnimation: {
        type: 'slide'
      },

      defaults: {
        scroll: 'vertical'
      },

      items: [
        {
          title: 'Clock',
          iconCls: 'time',
          cls: 'card_clock',
          id: 'card_clock',
          items: [clock_panel]
        },

        {
          title: 'Tasks',
          iconCls: 'check2',
          cls: 'card_tasks',
          items: [tasks_panel]
        },

        {
          title: 'Staistics',
          iconCls: 'chart2',
          cls: 'card_stats',
          items: [stats_panel]
        },

        {
          title: 'Settings',
          iconCls: 'settings',
          cls: 'card_settings',
          items: [settings_panel]
        }
      ]
    });


    /* use card layout model */
    var main_panel = new Ext.Panel({
      fullscreen: true,
      layout: 'card',
      items: [tabpanel]
    });

  }
});
