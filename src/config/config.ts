import { DEFAULT_HIDE, LABEL_SHORTCUT } from '../const';
import { MiniMediaPlayerActionEvent, MiniMediaPlayerBaseConfiguration, MiniMediaPlayerConfiguration } from './types';

const validate = (config: MiniMediaPlayerBaseConfiguration): void => {
  if (typeof config.entity === 'undefined') {
    throw new Error('You need to specify the required entity option.');
  }

  if (config.entity.split('.')[0] !== 'media_player') {
    throw new Error('Specify an entity from within the media_player domain.');
  }

  if (typeof config.type === 'undefined') {
    throw new Error('You need to specify the required type option.');
  }
};

export const generateConfig = (config: MiniMediaPlayerBaseConfiguration): MiniMediaPlayerConfiguration => {
  validate(config);

  const conf: MiniMediaPlayerConfiguration = {
    artwork: 'default',
    adaptive_color: false,
    info: 'default',
    media_info_lines: 0,
    card_height: '',
    group: false,
    volume_stateless: false,
    more_info: true,
    source: 'default',
    sound_mode: 'default',
    toggle_power: true,
    tap_action: {
      action: MiniMediaPlayerActionEvent.MORE_INFO,
    },
    jump_amount: 10,
    ...config,
    hide: { ...DEFAULT_HIDE, ...config.hide },
    speaker_group: {
      show_group_count: true,
      platform: 'sonos',
      supports_master: true,
      entities: [],
      ...config.sonos,
      ...config.speaker_group,
    },
    shortcuts: {
      label: LABEL_SHORTCUT,
      ...config.shortcuts,
    },
    max_volume: Number(config.max_volume) ?? 100,
    min_volume: Number(config.min_volume) || 0,
  };

  conf.media_info_lines = Math.max(0, Math.floor(Number(conf.media_info_lines) || 0));

  conf.card_height = (() => {
    const raw = conf.card_height;

    if (typeof raw === 'number') {
      return raw > 0 ? String(raw) + 'px' : '';
    }

    const value = String(raw || '').trim();

    if (!value || value === '0') return '';

    if (/^\d+$/.test(value)) {
      return value + 'px';
    }

    return value;
  })();
  
  conf.collapse = conf.hide.controls || conf.hide.volume;
  conf.info = conf.collapse && conf.info !== 'scroll' ? 'short' : conf.info;
  conf.flow = conf.hide.icon && conf.hide.name && conf.hide.info;

  return conf;
};

export default generateConfig;
