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
        type: 'slide',
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
          html: '<h1>Favorites Card</h1>',
          iconCls: 'check2',
          cls: 'card_tasks'
        },

        {
          title: 'Staistics',
          html: '<h1>Downloads Card</h1>',
          iconCls: 'chart2',
          cls: 'card_stats'
        },

        {
          title: 'Settings',
          html: '<h1>Settings Card</h1>',
          iconCls: 'settings',
          cls: 'card_settings'
        }]
    });
  }
});
