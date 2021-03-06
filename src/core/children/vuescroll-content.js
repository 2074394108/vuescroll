import {
  deepMerge,
  isSupportGivenStyle,
  insertChildrenIntoSlot
} from '../../util';
// ScrollContent, stateless, treat as a functional component
export default {
  name: 'scrollContent',
  functional: true,
  props: {
    ops: { type: Object },
    state: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  render(h, { props, slots, parent }) {
    let style = deepMerge(props.state.style, {});
    let width = isSupportGivenStyle('width', 'fit-content');

    if (width) {
      style.width = width;
    } /* istanbul ignore next */ else {
      // fallback to inline block while
      // doesn't support 'fit-content',
      // this may cause some issues, but this
      // can make `resize` event work...
      style['display'] = 'inline-block';
    }

    if (props.ops.padding) {
      style.paddingRight = props.ops.paddingValue;
    }

    const propsData = {
      style: style,
      ref: 'scrollContent',
      class: '__view'
    };

    const _customContent = parent.$slots['scroll-content'];
    if (_customContent) {
      return insertChildrenIntoSlot(
        h,
        _customContent,
        slots().default,
        propsData
      );
    }

    return <div {...propsData}>{slots().default}</div>;
  }
};

/**
 * create scroll content
 *
 * @param {any} size
 * @param {any} vm
 * @returns
 */
export function createContent(h, vm) {
  const scrollContentData = {
    props: {
      ops: vm.mergedOptions.scrollContent
    }
  };
  return (
    <scrollContent {...scrollContentData}>{[vm.$slots.default]}</scrollContent>
  );
}
