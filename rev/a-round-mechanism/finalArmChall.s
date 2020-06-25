    .syntax unified

    @ --------------------------------

.extern exit

.data
    buffer:   .string

    f:        .string


.global main
main:

    stmdb   sp!,{r11, lr}
    add     r11,sp,#4
    sub     sp,sp,#10

    mov     r0, #1
    ldr     r1, =message
    mov     r2, #115
    mov	    r7, #4
    swi     #0

    ldr     r2, =buffer
    mov     r0, #0
    mov     r1, #23

    loop2:
        ldrb    r3, [r2,r0]
        mov     r4, r3
        mov     r4, #0x0
        strb    r4, [r2,r0]

    add      r0, r0, #1
    cmp      r0, r1
    ble      loop2



    mov     r0, #0
    ldr     r1, =buffer
    mov     r2, #22
    mov     r7, #3
    swi     #0

    ldr     r2, =buffer
    mov     r0, #0
    mov     r1, #22

    loop:
        ldrb    r3, [r2,r0]
        mov     r4, r3
        eor     r4, r4, #0x12
        strb    r4, [r2,r0]
        cmp     r3, #0xa
        bleq      exit

    add      r0, r0, #1
    cmp      r0, r1
    ble      loop


    ldr     r0, =buffer
    mov     r1, #1
    bl      pepegas



    ldr     r2, =buffer
    ldr     r3, =sol
    mov     r0, #0
    mov     r1, #21
    mov     r8, #21
    mov     r6, #1
    loop3:
        ldrb    r4, [r2,r0]
        ldrb    r9, [r3,r1]
        cmp     r4, r9
        movne   r6, #0
        bne    lose

    add      r0, r0, #1
    sub      r1, r1, #1
    cmp      r0, r8
    ble      loop3


    cmp     r6, #1
    beq     win

    sub     sp, r11, #4
    ldmia   sp!, {r11, pc}








pepegas:
      str     lr, [sp,#-4]!
      str     ip, [sp,#-4]!
      str     r0, [sp,#-4]!
      str     r1, [sp,#-4]!
      sub     sp, sp, #8
      mov     ip, sp

      addlt   r1, r1, #1
      cmp     r1, #22
      bne     m
      mov     r0, #1
      b       done

m:

      cpy     r6, r0
      cpy     r8, r1

      ldrb    r9, [r6,r8]
      mov     r10, r9

      sub     r5, r8, #1

      ldrb    r12, [r6,r5]
      mov     r5, r12

      lsr     r5, r5, #1
      lsl     r10, r10, #1
      add     r7, r5, r10
      cpy     r10, r7
      lsr     r7, r7, #7
      lsr     r10, r10, r7
      sub     r10, r10, #1

      strb     r10, [r6,r8]


      ldr     r0, =buffer
      cpy     r1, r8
      bl      pepegas

done: add     sp, sp, #8
      ldr     r1, [sp], #4
      ldr     r0, [sp], #4
      ldr     ip, [sp], #4
      ldr     pc, [sp], #4






win:
    mov     r0, #1
    ldr     r1, =message2
    mov     r2, #36
    mov     r7, #4
    swi     #0

    ldr     r0, =flag
    mov     r1, #2
    mov     r7, #5
    swi     #0

    ldr     r1, =f
    mov     r2, #27
    mov     r7, #3
    swi     #0

    mov     r0, #1
    ldr     r1, =f
    mov     r2, #27
    mov     r7, #4
    swi     #0


    mov     r7, #1
    swi     #0




lose:
    mov     r0, #1
    ldr     r1, =message1
    mov     r2, #15
    mov     r7, #4
    swi     #0

    mov     r7, #1
    swi     #0










message:
    .asciz "I hear you've come to bargain for flags\n I'm a reasonable machine, if you guess the password I can give you a flag\n"


message1:
    .asciz "sorry, you lose"

message2:
    .asciz "Nice, you did it! Here's your flag: "


flag:
    .asciz "./flag.txt"


sol:
    .asciz "te@B}efFk~{^Ixv@}y\\BC4"


