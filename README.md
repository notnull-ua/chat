# chat
my first chat in php 111    <?php
class A {
    public function a1()
    {
        print 'a1,';
        $this->a2();
    self::a2();
    }

    public function a2()
    {
    print 'a2,';
    }
    }

    $a = new A();
    $a->a1();
    A::a2();
    ?>
