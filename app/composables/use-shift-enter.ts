export function useShiftEnter(callback: () => void) {
  const { shift, enter } = useMagicKeys()

  watchEffect(() => {
    if (shift?.value && enter?.value)
      callback()
  })
}
