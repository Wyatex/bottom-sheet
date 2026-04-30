import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import BottomSheet from '../src/components/BottomSheet.vue'

// jsdom 不支持 requestAnimationFrame / performance.now
beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => window.setTimeout(cb, 16) as unknown as number)
  vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id))
  Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })
  vi.spyOn(performance, 'now').mockReturnValue(0)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('BottomSheet', () => {
  it('should render with default structure', () => {
    const wrapper = mount(BottomSheet)
    expect(wrapper.find('.bottom-sheet').exists()).toBe(true)
    expect(wrapper.find('.drag-handle').exists()).toBe(true)
    expect(wrapper.find('.bar').exists()).toBe(true)
    expect(wrapper.find('.list-container').exists()).toBe(true)
  })

  it('should render slot content inside list-container', () => {
    const wrapper = mount(BottomSheet, {
      slots: {
        default: '<div class="custom-item">Hello</div>',
      },
    })
    const list = wrapper.find('.list-container')
    expect(list.find('.custom-item').exists()).toBe(true)
    expect(list.find('.custom-item').text()).toBe('Hello')
  })

  it('should initialise translateY to mid anchor (default 0.6 * innerHeight)', async () => {
    const wrapper = mount(BottomSheet)
    await nextTick()
    const style = wrapper.find('.bottom-sheet').attributes('style')
    expect(style).toContain('translateY(480px)') // 800 * 0.6
  })

  it('should use custom translateY anchors when provided', async () => {
    const wrapper = mount(BottomSheet, {
      props: {
        minTranslateY: 600,
        midTranslateY: 400,
        maxTranslateY: 100,
      },
    })
    await nextTick()
    // midTranslateY is the initial position
    const style = wrapper.find('.bottom-sheet').attributes('style')
    expect(style).toContain('translateY(400px)')
  })

  it('should handle touch gestures to pull sheet up', async () => {
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(50) // deltaTime > 0 so velocity is calculated

    const wrapper = mount(BottomSheet, {
      props: { maxTranslateY: 100 },
    })
    const sheet = wrapper.find('.bottom-sheet')

    // simulate swipe up: finger moves from y=500 to y=300 (deltaY > 0 = pull up)
    await sheet.trigger('touchstart', {
      touches: [{ clientY: 500 }],
    })
    await sheet.trigger('touchmove', {
      touches: [{ clientY: 300 }],
    })
    // translateY should have decreased (sheet moved up)
    const style = sheet.attributes('style')
    const match = style.match(/translateY\(([\d.]+)px\)/)
    expect(match).toBeTruthy()
    const currentY = parseFloat(match![1])
    expect(currentY).toBeLessThan(480)
  })

  it('should handle touch gestures to pull sheet down', async () => {
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(50)

    const wrapper = mount(BottomSheet)
    const sheet = wrapper.find('.bottom-sheet')

    // simulate swipe down: finger moves from y=300 to y=500 (deltaY < 0 = pull down)
    await sheet.trigger('touchstart', {
      touches: [{ clientY: 300 }],
    })
    await sheet.trigger('touchmove', {
      touches: [{ clientY: 500 }],
    })
    const style = sheet.attributes('style')
    const match = style.match(/translateY\(([\d.]+)px\)/)
    expect(match).toBeTruthy()
    const currentY = parseFloat(match![1])
    expect(currentY).toBeGreaterThan(480)
  })

  it('should clamp translateY to maxTranslateY when pulling up past it', async () => {
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(50)

    const wrapper = mount(BottomSheet, {
      props: { maxTranslateY: 200 },
    })
    const sheet = wrapper.find('.bottom-sheet')

    // large upward swipe
    await sheet.trigger('touchstart', {
      touches: [{ clientY: 600 }],
    })
    await sheet.trigger('touchmove', {
      touches: [{ clientY: 0 }],
    })
    const style = sheet.attributes('style')
    const match = style.match(/translateY\(([\d.]+)px\)/)
    expect(match).toBeTruthy()
    expect(parseFloat(match![1])).toBeGreaterThanOrEqual(200)
  })

  it('should emit load-more when list scrolls near bottom', async () => {
    const wrapper = mount(BottomSheet, {
      slots: {
        default: '<div style="height:2000px">tall content</div>',
      },
    })

    const list = wrapper.find('.list-container')
    // simulate scroll near bottom
    Object.defineProperty(list.element, 'scrollTop', { value: 900, writable: true })
    Object.defineProperty(list.element, 'scrollHeight', { value: 1000, writable: true })
    Object.defineProperty(list.element, 'clientHeight', { value: 50, writable: true })

    // trigger touchmove upward while sheet is already at max → scrolls list
    // We need the sheet to be at or below maxTranslateY so touchmove goes to list scroll
    // By default midTranslateY=480 which is > any reasonable maxTranslateY, so pull up first
    // Easier: dispatch the checkLoadMore logic by calling it indirectly via scroll
    // Actually we can directly trigger the list scroll event — but checkLoadMore is called
    // from handleTouchMove. Let's simulate a touch sequence that ends up scrolling the list.

    // The sheet starts at 480. Set maxTranslateY high (e.g. 500) so sheetTranslateY <= actualMaxY
    // is false, meaning upward swipe will scroll the list instead.
    const wrapper2 = mount(BottomSheet, {
      props: { maxTranslateY: 500 },
      slots: {
        default: '<div style="height:2000px">tall content</div>',
      },
    })

    const sheet2 = wrapper2.find('.bottom-sheet')
    const list2 = wrapper2.find('.list-container')

    // mock scrollTop/scrollHeight/clientHeight for load-more check
    Object.defineProperty(list2.element, 'scrollTop', { value: 900, writable: true })
    Object.defineProperty(list2.element, 'scrollHeight', { value: 1000, writable: true })
    Object.defineProperty(list2.element, 'clientHeight', { value: 50, writable: true })

    await sheet2.trigger('touchstart', {
      touches: [{ clientY: 500 }],
    })
    await sheet2.trigger('touchmove', {
      touches: [{ clientY: 300 }],
    })

    expect(wrapper2.emitted('load-more')).toBeTruthy()
  })

  it('should cancel previous inertia animation on new touchstart', async () => {
    const cancelSpy = vi.fn()
    vi.stubGlobal('cancelAnimationFrame', cancelSpy)

    // First, trigger an animation by calling touchend
    const wrapper = mount(BottomSheet)
    const sheet = wrapper.find('.bottom-sheet')

    await sheet.trigger('touchstart', {
      touches: [{ clientY: 400 }],
    })
    await sheet.trigger('touchmove', {
      touches: [{ clientY: 350 }],
    })
    await sheet.trigger('touchend')

    // Now trigger another touchstart — should cancel the previous rAF
    await sheet.trigger('touchstart', {
      touches: [{ clientY: 300 }],
    })

    expect(cancelSpy).toHaveBeenCalled()
  })
})
