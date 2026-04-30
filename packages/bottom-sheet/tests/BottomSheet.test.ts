import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BottomSheet from '../src/components/BottomSheet.vue'

describe('bottomSheet', () => {
  it('should render when modelValue is true', () => {
    const wrapper = mount(BottomSheet, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })
    expect(wrapper.find('.bottom-sheet').exists()).toBe(true)
  })

  it('should not render when modelValue is false', () => {
    const wrapper = mount(BottomSheet, {
      props: {
        modelValue: false,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })
    expect(wrapper.find('.bottom-sheet').exists()).toBe(false)
  })

  it('should apply custom height', () => {
    const wrapper = mount(BottomSheet, {
      props: {
        modelValue: true,
        height: '300px',
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })
    const sheet = wrapper.find('.bottom-sheet')
    expect(sheet.attributes('style')).toContain('height: 300px')
  })

  it('should emit update:modelValue when overlay is clicked', async () => {
    const wrapper = mount(BottomSheet, {
      props: {
        modelValue: true,
        closeOnOverlay: true,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })
    await wrapper.find('.bottom-sheet-overlay').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('should render slot content', () => {
    const wrapper = mount(BottomSheet, {
      props: {
        modelValue: true,
      },
      slots: {
        default: '<div class="custom-content">Hello</div>',
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Hello')
  })
})
