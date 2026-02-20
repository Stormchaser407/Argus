/**
 * Project Argus — Plugin Architecture
 * This module manages the integration of investigative tools into the core Telegram client.
 */

export interface ArgusPlugin {
  id: string;
  name: string;
  version: string;
  init: () => void;
}

const plugins: ArgusPlugin[] = [];

export function registerPlugin(plugin: ArgusPlugin) {
  console.log(`[Argus] Registering plugin: ${plugin.name} v${plugin.version}`);
  plugins.push(plugin);
}

export function initializePlugins() {
  console.log('[Argus] Initializing investigative toolkit...');
  plugins.forEach(plugin => {
    try {
      plugin.init();
    } catch (error) {
      console.error(`[Argus] Failed to initialize plugin ${plugin.id}:`, error);
    }
  });
}

export default plugins;
