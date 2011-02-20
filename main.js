var tabpanel;

Ext.setup({
  icon: 'icon.png',
  // tabletStartupScreen: 'tablet_startup.png',
  // phoneStartupScreen: 'phone_startup.png',
  // glossOnIcon: false,

  onReady: function() {

    /* ============== CLOCKING ============ */

    var clock_in = function() {
      Ext.getCmp('clock-in-button').disable();
      Ext.getCmp('clock-out-button').enable();
    };

    var clock_out = function() {
      Ext.getCmp('clock-in-button').enable();
      Ext.getCmp('clock-out-button').disable();
    };


    var clock_panel = new Ext.Panel({
      fullscreen: true,

      dockedItems: [
        {
          dock : 'top',
          xtype: 'toolbar',
          title: 'Workaholic'
        }
      ],

      layout: 'vbox',

      items: [
        {
          xtype: 'button',
          id: 'clock-in-button',
          componentCls: 'clock-button',
          text: 'Clock in',
          handler: clock_in
        },

        {
          xtype: 'button',
          id: 'clock-out-button',
          componentCls: 'clock-button',
          text: 'Clock out',
          disabled: true,
          handler: clock_out
        }
      ]
    });



    /* ============== TASKS ============ */

    var tasks_panel = new Ext.Panel({
      fullscreen: true,

      dockedItems: [
        {
          dock : 'top',
          xtype: 'toolbar',
          title: 'Tasks'
        }
      ],

      items: [
        {
          xtype: 'panel',
          html: '<p><br /><center>Not yet implemented</center></p>'
        }
      ]

    });



    /* ============== STATISTICS ============ */

    var stats_panel = new Ext.Panel({
      fullscreen: true,

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

    });



    /* ============== SETTINGS ============ */

    var settings_panel = new Ext.Panel({
      fullscreen: true,

      dockedItems: [
        {
          dock : 'top',
          xtype: 'toolbar',
          title: 'Settings'
        }
      ],

      items: [
        {
          xtype: 'fieldset',
          title: 'Clock settings',
          defaults: {
            // labelAlign: 'right'
            // labelWidth: '35%'
          },

          items: [
            {
              xtype: 'numberfield',
              name: 'name',
              label: 'Name',
              value: 40
            }
          ]

        }
      ]

    });




    /* ============== MAIN PANEL ============ */
    tabpanel = new Ext.TabPanel({
      tabBar: {
        dock: 'bottom',
        layout: {
          pack: 'center'
        }
      },

      fullscreen: true,

      ui: 'light',
      cardSwitchAnimation: {
        type: 'flip',
        cover: true
      },

      defaults: {
        scroll: 'vertical'
      },

      items: [
        {
          title: 'Clock',
          iconCls: 'power_on',
          cls: 'card_clock',
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
        }]
    });
  }
});
