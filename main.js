Ext.setup({
  icon: 'icon.png',
  // tabletStartupScreen: 'tablet_startup.png',
  // phoneStartupScreen: 'phone_startup.png',
  // glossOnIcon: false,

  onReady: function() {

    var tabpanel = new Ext.TabPanel({
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
          html: 'hello world',
          iconCls: 'power_on',
          cls: 'card_clock'
        },

        {
          title: 'Tasks',
          html: '<h1>Favorites Card</h1>',
          iconCls: 'check2',
          cls: 'card_tasks'// ,
          // badgeText: '1'
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
