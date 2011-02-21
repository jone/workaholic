var tabpanel;
var debug;


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


    var clock_panel = {

      dockedItems: [
        {
          dock : 'top',
          xtype: 'toolbar',
          title: 'Workaholic',

          items: [
            {xtype: 'spacer'},

            {xtype: 'button',
             text: 'Reload',
             handler: function() {
               window.location.reload();
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
    };



    /* ============== TASKS ============ */

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

            ]}

         ]}
      ],

      listeners: {
        beforeactivate: function(button) {
          var form = Ext.getCmp('task_details_panel-task_form');
          form.record = null;
          /* reset fields */
          form.getFieldsAsArray().forEach(function(field) {
            field.setValue('');
          });
          form.reset();

          if(task_details_panel._record !== null) {
            debug = {form: form, record: task_details_panel._record};
            form.loadRecord(task_details_panel._record);
          }
        }
      }
    });

    var tasks_panel = new Ext.Panel({
      dockedItems: [
        {
          dock : 'top',
          xtype: 'toolbar',
          title: 'Tasks',
          items: [
            {xtype: 'spacer'},
            {xtype: 'button',
             text: 'New',
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
          store: get_tasks_store(),
          itemTpl: '{title}',
          onItemDisclosure: function(record, btn, index) {
            task_details_panel._record = record;
            main_panel.setActiveItem(task_details_panel, 'flip');
          }
        }
      ]

    });



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
