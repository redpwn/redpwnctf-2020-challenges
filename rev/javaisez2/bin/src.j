; Use https://github.com/Storyyeller/Krakatau to assemble into classfile
; A RedpwnCTF 2020 challenge

; Semantically equivalent, non-obfuscated Java code
; public class JavaIsEZ2 {
;   private static int hash(String s) {
;     char[] val = s.toCharArray();
;     int h = 0;
;
;     for (int i = 0; i < val.length; i++) {
;       h = 31 * h + val[i];
;     }
;
;     return h;
;   }
;
;   private static boolean check1(long j) {
;     int n = hash("redpwn");
;     long lol = (long) n << 32 | n;
;
;     return (lol ^ 0x727756a076dbe2b2L) == (j * 0xcafebabe);
;   }
;
;   private static boolean check2(long j) {
;     int n = hash("ctf2020");
;     long lol = (long) n << 32 | n;
;
;     return (lol ^ 0xb5db07b30685ff09L) == (j * 0xdeadbeef);
;   }
;
;   private static void fail() {
;     System.println("pepega")
;     System.exit(0);
;   }
;
;   private static void win() {
;     System.println("Oh nice, you found my key :O");
;     System.exit(0);
;   }
;
;   public static void main(String[] args) {
;     if (args.length != 1 || args[0].length() != 32 || hash("flag{" + args[0] + "}") != 1140336659) {
;       fail();
;     }
;
;     long j1 = Long.parseLong(args[0].substring(0, 16), 16);
;     long j2 = Long.parseLong(args[0].substring(16), 16);
;     if (check1(j1) && check2(j2)) {
;       win();
;     } else {
;       fail();
;     }
;   }
; }

; J5 - Allows JSR + no stackframes
.version 49 0

; Define class 'JavaIsEZ2
.class public super JavaIsEZ2
    ; Extends java.lang.Object
    .super java/lang/Object

    .field private static synthetic a [Ljava/lang/String;
    .field private static synthetic a [J
    .field private static synthetic a I

    .method static synthetic <clinit> : ()V
        .code stack 10 locals 0
            iconst_2
            anewarray java/lang/String
            dup
            iconst_0
            ldc "redpwn"
            aastore
            dup
            iconst_1
            ldc "ctf2020"
            aastore
            putstatic JavaIsEZ2 a [Ljava/lang/String;

            iconst_4
            newarray long
            dup
            iconst_0
            ldc2_w 8248156489741230770L  ; 0x727756a076dbe2b2L
            lastore
            dup
            iconst_1
            ldc2_w -5342668067454976247L ; 0xb5db07b30685ff09L
            lastore
            dup
            iconst_2
            ldc2_w -889275714L           ; 0xcafebabeL
            lastore
            dup
            iconst_3
            ldc2_w -559038737L           ; 0xdeadbeefL
            lastore
            putstatic JavaIsEZ2 a [J

            return
        .end code
    .end method

    ; public static void main(String[]) {}
    .method public static synthetic bridge main : ([Ljava/lang/String;)V 
        .code stack 10 locals 20
            goto Lfunc_main
        Lfunc_hash:
            ; address var_1; (return address)
            ; Object  var_2; (string to compute hash of)
            ; int     var_3; (computed hash)
            ; int     var_4; (loop counter)
            ; int     var_10;
            astore_1    ; var_1 = ret_addr

            aload_2
            invokevirtual java/lang/String toCharArray ()[C
            astore_2    ; var_2 = ((String) var_2).toCharArray()

            iconst_0
            istore_3    ; var_3 = 0 (hash)
            
            aload_0
            ifnull Lbogus_jump2

            iconst_0
            istore 4    ; var_4 = 0 (loop counter var)

            Lfunc_hash_monitorenter_loop_enter:
                iload 4
                aload_2
                arraylength
                iconst_m1
                ixor
                iconst_2
                iadd
                ineg
                if_icmpeq Lfunc_hash_monitorenter_loop_exit ; if (i == var2.length)

                aload_2
                monitorenter

                iload 4
                iflt Lbogus_jump6

                iload 4
                iconst_1
                iadd
                istore 4    ; var_4 = var_4 + 1
                goto Lfunc_hash_monitorenter_loop_enter
            Lfunc_hash_monitorenter_loop_exit:

            iconst_0
            istore 4
            iconst_1
            istore 10
            aconst_null

            Lfunc_hash_loop_enter:
                pop
                Lloop:
                    iload 10
                    ifeq Lfunc_hash_loop_exit
                    iload 10
                    iconst_1
                    isub
                    istore 10

                    bipush 31
                    iload_3
                    imul
                    aload_2
                    iload 4
                    caload
                    iadd
                    istore 3    ; var_3 = 31 * var_3 + ((char[]) var_2)[var4]

                    aload_2
                    monitorexit
                    iconst_1
                    iload 4
                    iadd
                    istore 4    ; var_4 = var_4 + 1

                    iload 10
                    iflt L0
                    iconst_1
                    istore 10
                    goto Lloop
            Lfunc_hash_loop_exit:

            .catch java/lang/IllegalMonitorStateException from Lfunc_hash_loop_enter to Lfunc_hash_loop_exit using Lfunc_hash_loop_enter
            ret 1
        Lfunc_fail:
            ; address var_8; (return address)
            astore 8
            iconst_0
            getstatic java/lang/System out Ljava/io/PrintStream;
            ldc "That is pepega"
            invokevirtual java/io/PrintStream println (Ljava/lang/String;)V
            invokestatic java/lang/System exit (I)V
            aload_0
            ifnonnull Lbogus_jump6
            ret 8
        Lfunc_win:
            ; address var_8; (return address)
            astore 8
            iconst_0
            getstatic java/lang/System out Ljava/io/PrintStream;
            ldc "Oh nice, you found my key :O"
            invokevirtual java/io/PrintStream println (Ljava/lang/String;)V
            invokestatic java/lang/System exit (I)V
            ret 8
        Lfunc_main:
            ; Obf stuff
            L0:
                aconst_null
                checkcast 'RedpwnCTF2020'
                ldc 'java.utils.ArrayList'
                invokestatic java/lang/Class forName (Ljava/lang/String;)Ljava/lang/Class;
                invokestatic java/util/concurrent/ThreadLocalRandom current ()Ljava/util/concurrent/ThreadLocalRandom;
                iconst_1
                bipush 28
                invokevirtual java/util/concurrent/ThreadLocalRandom nextInt (II)I
                putstatic JavaIsEZ2 a I
                pop2
            L1:
                .catch [0] from L0 to L1 using L2
                .catch [0] from L3 to L4 using L2
                .catch [0] from L20 to L21 using L2
            L3:
                aload_0
                aconst_null
                astore_0
                monitorexit
            L4:
                goto L0
            L20:
                aconst_null
                athrow
            L21:
                goto L0
            L2: ; (Actual stuff)
                ; String[] var_0; (arg array)
                ; address  var_1; (return address)
                ; Object   var_2; (string to compute hash of)
                ; int      var_3; (computed hash)
                ; int      var_4; (loop counter)
                ; long     var_5; (key to check)
                ;          var_6; (long_top)
                ; int      var_7; (indicator of which check to perform)
                ; int      var_9; (predicate)
                ifnull L0
                getstatic JavaIsEZ2 a I
                aload_0
                swap
                istore 9
                arraylength
                iconst_1
                if_icmpne Lfunc_main_fail ; if (var_0.length != 1) call(Lfunc_main_fail);
            Lbogus_jump1:
                iload 9
                ifne L20
                iconst_1
                istore 9
            Lbogus_jump2:
                aload_0
                iconst_0
                aaload
                invokevirtual java/lang/String length ()I
                bipush 32
                if_icmpne Lfunc_main_fail ; if (((String) var_0[0]).length != 32) call(Lfunc_main_fail);
            Lbogus_jump3:
                iload 9
                ifeq L0
                iconst_0
                istore 9
            Lbogus_jump4:
                new java/lang/StringBuilder
                dup
                invokespecial java/lang/StringBuilder <init> ()V
                ldc "flag{"
                invokevirtual java/lang/StringBuilder append (Ljava/lang/CharSequence;)Ljava/lang/StringBuilder;
                aload_0
                iconst_0
                aaload
                invokevirtual java/lang/StringBuilder append (Ljava/lang/CharSequence;)Ljava/lang/StringBuilder;
                ldc "}"
                invokevirtual java/lang/StringBuilder append (Ljava/lang/CharSequence;)Ljava/lang/StringBuilder;
                invokevirtual java/lang/StringBuilder toString ()Ljava/lang/String;
                astore_2
                jsr Lfunc_hash
                iload_3
                ldc Int 1140336659
                if_icmpne Lfunc_main_fail ; if (hash("flag{" + var_0[0] + "}") != 1140336659) call(Lfunc_main_fail);
            Lbogus_jump5:
                iload 9
                ifne L20
                iconst_1
                istore 9
            Lbogus_jump6:
                iconst_0
                istore 7 ; var_7 = 0
                Lfunc_main_check_input:
                    aload_0
                    iconst_0
                    aaload
                    iload 7
                    ifne Lfunc_main_check_input_second ; if (var_7 != 0)
                    Lfunc_main_check_input_first:
                        iconst_0
                        bipush 16
                        invokevirtual java/lang/String substring (II)Ljava/lang/String;
                        goto Lfunc_main_lol
                    Lfunc_main_check_input_second:
                        bipush 16
                        invokevirtual java/lang/String substring (I)Ljava/lang/String;
                    Lfunc_main_lol:
                    bipush 16
                    invokestatic java/lang/Long parseLong (Ljava/lang/String;I)J
                    lstore 5
                    getstatic JavaIsEZ2 a [Ljava/lang/String;
                    iload 7
                    aaload
                    astore_2        ; var_2 = JavaIsEZ2.a[var_7] (String)

                    jsr Lfunc_hash  ; var_3 = func_hash()

                    iload_3
                    i2l             ; temp1 = (long) var_3
                    dup2            ; temp2 = (long) var_3
                    
                    bipush 32
                    lshl            ; temp2 = temp2 << 32
                    lor             ; temp1 = temp1 | temp2

                    getstatic JavaIsEZ2 a [J
                    iload 7
                    laload          
                    lxor            ; temp1 = temp1 ^ JavaIsEZ2.a[var_7] (long)

                    lload 5
                    getstatic JavaIsEZ2 a [J
                    iload 7
                    iconst_2
                    iadd
                    laload
                    lmul            ; temp2 = var_5 * JavaIsEZ2.a[var_7 + 2] (long)

                    lcmp
                    istore_3        ; var_3 = Long.compare(temp1, temp2)

                    iload 9
                    lookupswitch
                        12 : L0
                        66 : L20
                        3 : Lbogus_jump1
                        54 : Lbogus_jump2
                        55 : Lbogus_jump3
                        30 : Lbogus_jump4
                        10 : Lbogus_jump5
                        20 : Lbogus_jump6
                        57 : Lbogus_jump7
                        29 : Lbogus_jump8
                        16 : Lbogus_jump9
                        2 : Lbogus_jump10
                        21 : Lbogus_jump11
                        50 : Lbogus_jump12
                        default : Lnext
                    Lnext:
                Lfunc_main_check_input_end:
            Lbogus_jump7:
                iload_3
                ifne Lfunc_main_fail
            Lbogus_jump8:
                iload 9
                ifeq L20
                iconst_0
                istore 9
            Lbogus_jump9:
                iconst_1
                iload 7
                iadd
                istore 7
            Lbogus_jump10:
                iload 9
                ifne L20
                iconst_1
                istore 9
            Lbogus_jump11:
                iconst_2
                iload 7
                if_icmpne Lfunc_main_check_input
            Lbogus_jump12:
                jsr Lfunc_win
                return
                Lfunc_main_fail:
                    jsr Lfunc_fail
                    return
        .end code
    .end method

    .method public static print : (J)J
        .code stack 10 locals 10
            getstatic java/lang/System out Ljava/io/PrintStream;
            lload_0
            invokevirtual java/io/PrintStream println (J)V
            lload_0
            lreturn
        .end code
    .end method

    ; Bogus SourceFile attribute
    .sourcefile 'RedpwnCTF2020'
.end class
